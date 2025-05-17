import bcrypt from 'bcryptjs';
import { Franchise } from '../../models/franchise/franchise.models.js';
import { asyncHandler } from '../../utils/asynchanlder.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../../utils/cloudinary.js';
import { sendEmail } from '../../utils/mailer.js'; // Import the email utility

// Helper function to generate Franchise ID (Example: SK + 6 random digits)
const generateFranchiseId = async () => {
    let uniqueId = false;
    let franchiseId;
    while (!uniqueId) {
        franchiseId = `SK${Math.floor(100000 + Math.random() * 900000)}`;
        const existing = await Franchise.findOne({ franchiseId });
        if (!existing) {
            uniqueId = true;
        }
    }
    return franchiseId;
};

// Helper function to generate a simple password (Example: 8 random digits)
const generatePassword = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Controller for SUPER ADMIN to create a new franchise (starts as Pending)
const addFranchiseByAdmin = asyncHandler(async (req, res) => {
    // Extract data from request body - including new fields
    const {
        franchiseName, ownerName, designation, dob, email, mobile, address, state, city, country, postalCode,
        planValidityDays, gstNumber, atcCode,
        totalComputers, totalStudents // Added fields
    } = req.body;

    // Basic validation - required fields remain the same
    const requiredFields = [franchiseName, ownerName, designation, dob, email, mobile, address, state, city, postalCode, planValidityDays];
    if (requiredFields.some((field) => !field || (typeof field === 'string' && field.trim() === ""))) {
        throw new ApiError(400, "All required fields must be provided");
    }

    // Validate planValidityDays
    if (![90, 180, 365].includes(Number(planValidityDays))) {
        throw new ApiError(400, "Invalid Plan Validity selected.");
    }

    // Check for existing franchise by email
    const existingFranchise = await Franchise.findOne({ email });
    if (existingFranchise) {
        throw new ApiError(409, `Franchise with this email already exists`);
    }

    // --- Handle File Uploads ---
    let ownerPhotoUrl = null;
    let franchiseSignatureUrl = null;
    if (req.files) {
        if (req.files.ownerPhoto && req.files.ownerPhoto[0]) {
            const photoUploadResult = await uploadOnCloudinary(req.files.ownerPhoto[0].path);
            if (!photoUploadResult) throw new ApiError(500, "Failed to upload owner photo");
            ownerPhotoUrl = photoUploadResult.url;
        }
        if (req.files.franchiseSignature && req.files.franchiseSignature[0]) {
            const signatureUploadResult = await uploadOnCloudinary(req.files.franchiseSignature[0].path);
            if (!signatureUploadResult)  throw new ApiError(500, "Failed to upload franchise signature");
            franchiseSignatureUrl = signatureUploadResult.url;
        }
    }
    // --- End File Uploads ---

    // Generate Franchise ID and Password
    const franchiseId = await generateFranchiseId();
    const rawPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10); // Hash the password

    // Create new franchise instance - Admin Created = Pending Status & Verification by default
    // Robust handling for optional number fields: parse if present and valid, otherwise default to 0
    const numComputers = (totalComputers && !isNaN(parseInt(totalComputers))) ? parseInt(totalComputers) : 0;
    const numStudents = (totalStudents && !isNaN(parseInt(totalStudents))) ? parseInt(totalStudents) : 0;


    // Create new franchise instance - Admin Created = Pending Status & Verification by default
    const newFranchise = await Franchise.create({
        franchiseName, ownerName, designation, dob, email, mobile, address, state, city, country, postalCode,
        totalComputers: numComputers,
        totalStudents: numStudents,
        franchiseId, // ID is generated
        password: hashedPassword, // Password is generated and hashed
        planValidityDays: parseInt(planValidityDays),
        status: 'Pending', // Default status
        verificationStatus: 'Pending', // Default verification status
        applicationType: 'AdminCreated',
        // activationDate: null, // Do not set activation date initially
        gstNumber,
        atcCode,
        ownerPhotoUrl,
        franchiseSignatureUrl,
        requestDate: new Date() // Set request date now
        // expireDate will be calculated by pre-save hook when activationDate is set later
    });

    if (!newFranchise) {
        throw new ApiError(500, "Failed to create franchise record");
    }

    // Log info - Note: Credentials are created but franchise is NOT active yet.
    // NO email should be sent here yet. Email is sent upon activation via updateFranchiseStatusVerification.
    console.log(`--- Admin Created Franchise (Pending Activation/Verification) ---`);
    console.log(`   Franchise Name: ${franchiseName}`);
    console.log(`   Email: ${email}`);
    console.log(`   Generated ID: ${franchiseId}`);
    console.log(`   Generated Password: ${rawPassword} (Store securely if needed before activation)`);
    console.log(`   Go to 'Requests Stack' to Verify and Activate.`);
    console.log(`----------------------------------------------------------------`);

    // Return success response (don't send password back)
    const createdFranchiseData = newFranchise.toObject();
    delete createdFranchiseData.password;

    return res.status(201).json(
        new ApiResponse(201, createdFranchiseData, "Franchise created successfully. Please verify and activate from the requests stack.")
    );
});

// Controller for FRANCHISE to apply (Placeholder - Future Implementation)
const applyForFranchise = asyncHandler(async (req, res) => {
    // 1. Extract data (similar to admin, but no franchiseId/password initially)
    // 2. Basic validation
    // 3. Check for existing email
    // 4. Handle file uploads (if any required for application)
    // 5. Create Franchise record with:
    //    - status: 'Pending'
    //    - verificationStatus: 'Pending'
    //    - applicationType: 'FranchiseApplied'
    //    - requestDate: new Date()
    //    - NO franchiseId, password, activationDate yet
    // 6. Return success response
    throw new ApiError(501, "Franchise application endpoint not yet implemented.");
});


// Controller to get all franchises NOT Active & Verified (for the Request Stack)
const getFranchiseRequests = asyncHandler(async (req, res) => {
    // Fetch franchises that are NOT (Active AND Verified)
    // This includes: Pending, Rejected, Inactive, or Active but Pending/Rejected verification, or Verified but Pending/Inactive/Rejected status
    const requests = await Franchise.find({
        $or: [
            { status: { $ne: 'Active' } }, // Status is not Active OR
            { verificationStatus: { $ne: 'Verified' } } // Verification is not Verified
        ]
    }).sort({ requestDate: -1 }); // Sort by newest request first

    if (!requests) {
        throw new ApiError(500, "Error retrieving franchise requests/non-active franchises");
    }

     // Exclude password from the response data
    const responseData = requests.map(f => {
        const franchiseObj = f.toObject();
        delete franchiseObj.password;
        return franchiseObj;
    });

    return res.status(200).json(
        new ApiResponse(200, responseData, "Franchise requests and non-active/verified retrieved successfully")
    );
});

// Controller for ADMIN to update Status and Verification
const updateFranchiseStatusVerification = asyncHandler(async (req, res) => {
    const { franchiseId } = req.params; // Get ID from URL parameter
    const { status, verificationStatus } = req.body;

    // Validate input
    if (!franchiseId) {
        throw new ApiError(400, "Franchise ID is required in the URL path.");
    }
    const validStatuses = ['Pending', 'Active', 'Inactive', 'Rejected'];
    const validVerificationStatuses = ['Pending', 'Verified', 'Rejected'];

    if (status && !validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status value. Must be one of: ${validStatuses.join(', ')}`);
    }
    if (verificationStatus && !validVerificationStatuses.includes(verificationStatus)) {
        throw new ApiError(400, `Invalid verification status value. Must be one of: ${validVerificationStatuses.join(', ')}`);
    }
    if (!status && !verificationStatus) {
         throw new ApiError(400, "At least one field (status or verificationStatus) must be provided for update.");
    }

    // Find the franchise
    const franchise = await Franchise.findById(franchiseId);
    if (!franchise) {
        throw new ApiError(404, "Franchise not found with the provided ID.");
    }

    // Prepare updates
    const updates = {};
    let needsCredentials = false; // Flag if ID/Password need generation

    if (status) {
        updates.status = status;
        // If activating, set activation date (if not already set) and check if credentials need generation
        if (status === 'Active' && !franchise.activationDate) {
            updates.activationDate = new Date();
            if (!franchise.franchiseId || !franchise.password) {
                needsCredentials = true;
            }
        }
    }
    if (verificationStatus) {
        updates.verificationStatus = verificationStatus;
    }

    // Generate ID and Password if activating a franchise application that doesn't have them
    let rawPassword = null; // Store plain-text password for email if generated
    if (needsCredentials) {
        updates.franchiseId = await generateFranchiseId();
        rawPassword = generatePassword();
        updates.password = await bcrypt.hash(rawPassword, 10);
        console.log(`Generated Credentials for ${franchise.email}: ID=${updates.franchiseId}, Pass=${rawPassword}`);
    }

    // Apply updates
    Object.assign(franchise, updates);
    const updatedFranchise = await franchise.save();

    if (!updatedFranchise) {
        throw new ApiError(500, "Failed to update franchise status/verification.");
    }

    // --- Notification Logic ---
    // Check the final state *after* the update
    const finalStatus = updatedFranchise.status;
    const finalVerification = updatedFranchise.verificationStatus;
    const recipientEmail = updatedFranchise.email;
    const franchiseName = updatedFranchise.franchiseName;

    // Send email ONLY when the franchise becomes BOTH Active and Verified
    if (finalStatus === 'Active' && finalVerification === 'Verified') {
        let passwordToSend = rawPassword; // Use password generated in this step, if any

        // If credentials were NOT generated in this step (rawPassword is null),
        // generate a NEW password now to send.
        if (!passwordToSend) {
            passwordToSend = generatePassword();
            const newHashedPassword = await bcrypt.hash(passwordToSend, 10);
            // Update the database with the new hashed password
            await Franchise.findByIdAndUpdate(updatedFranchise._id, { password: newHashedPassword });
            console.log(`--- Generated NEW password during activation for ${updatedFranchise.email} ---`);
            // No need to update in-memory `updatedFranchise.password` as we won't use it below
        }

        // Now we are guaranteed to have a plain-text password in passwordToSend
        const ownerName = updatedFranchise.ownerName;
        const interval = `${updatedFranchise.planValidityDays} days`;
        const presentDate = updatedFranchise.activationDate
            ? updatedFranchise.activationDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'N/A';
        const expiryDate = updatedFranchise.expireDate
            ? updatedFranchise.expireDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'N/A';
        const loginId = updatedFranchise.franchiseId;

        const subject = `SK Edutech Franchise Activated: ${franchiseName}`;
        let textBody = '';
        let htmlBody = '';

        // Construct the email body based on your template
        textBody = `Congrats ${ownerName},\n\nSK Edutech Admin has verified and activated your plan to be a prestigious franchise for the interval of ${interval} from ${presentDate} to ${expiryDate}.\n\n`;
        htmlBody = `<p>Congrats ${ownerName},</p>
                    <p>SK Edutech Admin has verified and activated your plan to be a prestigious franchise for the interval of <b>${interval}</b> from <b>${presentDate}</b> to <b>${expiryDate}</b>.</p>`;

        // Always include Franchise ID and the (potentially newly generated) password
        textBody += `Your Franchise ID is ${loginId} and password is ${passwordToSend}. Please use these credentials to login in your dashboard.\n\n`;
        htmlBody += `<p>Your Franchise ID is <b>${loginId}</b> and password is <b>${passwordToSend}</b>. Please use these credentials to login in your dashboard.</p>`;

        console.log(`--- Franchise Activated & Verified ---`);
        console.log(`   Franchise ID: ${loginId}`);
        console.log(`   Password Sent: ${passwordToSend}`); // Log plain text password being sent
        console.log(`   Email to: ${recipientEmail}`);
        console.log(`----------------------------------------------------------------`);


        textBody += `If you have any other doubts. Please contact us at help@skedutech.in\n\nWe will try to resolve the issue if any at the earliest possible.\n\nRegards,\nThe SK Edutech Team`;
        htmlBody += `<p>If you have any other doubts. Please contact us at help@skedutech.in</p>
                     <p>We will try to resolve the issue if any at the earliest possible.</p>
                     <p>Regards,<br>The SK Edutech Team</p>`;

        // Send the activation/verification email
        try {
            await sendEmail(recipientEmail, subject, textBody, htmlBody);
        } catch (emailError) {
            console.error(`!!! Failed to send activation/verification email to ${recipientEmail}:`, emailError.message);
            // Decide if this should cause the API request to fail or just log the error
            // For now, we just log it and the API request still succeeds.
        }

    } else if (status === 'Rejected') { // Check if status was explicitly set to Rejected in *this* update
         const subject = `Update on your SK Edutech Franchise Application`;
         const textBody = `Hello ${franchiseName},\n\nWe regret to inform you that your franchise application/status with SK Edutech has been set to 'Rejected'. Please contact support if you have questions.\n\nRegards,\nThe SK Edutech Team`;
         const htmlBody = `<p>Hello ${franchiseName},</p><p>We regret to inform you that your franchise application/status with SK Edutech has been set to 'Rejected'. Please contact support if you have questions.</p><p>Regards,<br>The SK Edutech Team</p>`;
         console.log(`--- Franchise Status Set to Rejected ---`);
         console.log(`   Email to: ${recipientEmail}`);
         console.log(`--------------------------------------`);
         try {
            await sendEmail(recipientEmail, subject, textBody, htmlBody);
         } catch (emailError) {
             console.error(`!!! Failed to send rejection email to ${recipientEmail}:`, emailError.message);
         }

    } else if (status === 'Inactive') { // Check if status was explicitly set to Inactive in *this* update
         const subject = `Your SK Edutech Franchise Status Update`;
         const textBody = `Hello ${franchiseName},\n\nYour franchise status with SK Edutech has been set to 'Inactive'. Please contact support if you believe this is an error.\n\nRegards,\nThe SK Edutech Team`;
         const htmlBody = `<p>Hello ${franchiseName},</p><p>Your franchise status with SK Edutech has been set to 'Inactive'. Please contact support if you believe this is an error.</p><p>Regards,<br>The SK Edutech Team</p>`;
         console.log(`--- Franchise Status Set to Inactive ---`);
         console.log(`   Email to: ${recipientEmail}`);
         console.log(`--------------------------------------`);
          try {
            await sendEmail(recipientEmail, subject, textBody, htmlBody);
         } catch (emailError) {
             console.error(`!!! Failed to send inactivation email to ${recipientEmail}:`, emailError.message);
         }
    }
    // Note: No specific email for just 'Verified' without being 'Active', or vice-versa.

    // --- End Notification Logic ---


    // Return success response (don't send password back)
    const responseData = updatedFranchise.toObject();
    delete responseData.password;

    return res.status(200).json(
        new ApiResponse(200, responseData, "Franchise status/verification updated successfully")
    );
});


// Controller to get all ACTIVE & VERIFIED franchises (for the main list)
const getAllActiveFranchises = asyncHandler(async (req, res) => {
    // Fetch franchises that are both Active and Verified
    // TODO: Add pagination, sorting, filtering features later
    const franchises = await Franchise.find({
        status: 'Active',
        verificationStatus: 'Verified'
    }).sort({ franchiseName: 1 }); // Sort by name

    if (!franchises) {
        throw new ApiError(500, "Error retrieving active & verified franchises");
    }

    // Exclude password from the response data
    const responseData = franchises.map(f => {
        const franchiseObj = f.toObject();
        delete franchiseObj.password;
        return franchiseObj;
    });


    return res.status(200).json(
        new ApiResponse(200, responseData, "Active & Verified franchises retrieved successfully")
    );
});

// Controller to get a single franchise by its MongoDB _id
const getFranchiseById = asyncHandler(async (req, res) => {
    const { franchiseId } = req.params;
    if (!franchiseId) {
        throw new ApiError(400, "Franchise ID is required.");
    }

    const franchise = await Franchise.findById(franchiseId);
    if (!franchise) {
        throw new ApiError(404, "Franchise not found.");
    }

    // Exclude password from the response data
    const responseData = franchise.toObject();
    delete responseData.password;

    return res.status(200).json(
        new ApiResponse(200, responseData, "Franchise retrieved successfully")
    );
});

// Controller to update a franchise by its MongoDB _id
const updateFranchiseById = asyncHandler(async (req, res) => {
    const { franchiseId } = req.params;
    if (!franchiseId) {
        throw new ApiError(400, "Franchise ID is required.");
    }

    // Extract allowed fields for update. Exclude sensitive fields like password, franchiseId (system-generated), status, verificationStatus (managed separately)
    const {
        franchiseName, ownerName, designation, dob, email, mobile, address, state, city, country, postalCode,
        planValidityDays, gstNumber, atcCode, totalComputers, totalStudents
    } = req.body;

    const updateData = {
        franchiseName, ownerName, designation, dob, email, mobile, address, state, city, country, postalCode,
        planValidityDays, gstNumber, atcCode, totalComputers, totalStudents
    };

    // Remove undefined fields so they don't overwrite existing data with null
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No valid fields provided for update.");
    }

    // Handle file uploads if new files are provided
    if (req.files) {
        if (req.files.ownerPhoto && req.files.ownerPhoto[0]) {
            const photoUploadResult = await uploadOnCloudinary(req.files.ownerPhoto[0].path);
            if (!photoUploadResult) throw new ApiError(500, "Failed to upload new owner photo");
            updateData.ownerPhotoUrl = photoUploadResult.url;
        }
        if (req.files.franchiseSignature && req.files.franchiseSignature[0]) {
            const signatureUploadResult = await uploadOnCloudinary(req.files.franchiseSignature[0].path);
            if (!signatureUploadResult) throw new ApiError(500, "Failed to upload new franchise signature");
            updateData.franchiseSignatureUrl = signatureUploadResult.url;
        }
    }
    
    // If email is being updated, check for duplicates (excluding the current franchise)
    if (email) {
        const existingFranchiseWithEmail = await Franchise.findOne({ email, _id: { $ne: franchiseId } });
        if (existingFranchiseWithEmail) {
            throw new ApiError(409, "Another franchise with this email already exists.");
        }
    }


    const updatedFranchise = await Franchise.findByIdAndUpdate(
        franchiseId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedFranchise) {
        throw new ApiError(404, "Franchise not found or failed to update.");
    }

    const responseData = updatedFranchise.toObject();
    delete responseData.password;

    return res.status(200).json(
        new ApiResponse(200, responseData, "Franchise updated successfully")
    );
});

// Controller to delete a franchise by its MongoDB _id
const deleteFranchiseById = asyncHandler(async (req, res) => {
    const { franchiseId } = req.params;
    if (!franchiseId) {
        throw new ApiError(400, "Franchise ID is required.");
    }

    const deletedFranchise = await Franchise.findByIdAndDelete(franchiseId);

    if (!deletedFranchise) {
        throw new ApiError(404, "Franchise not found or already deleted.");
    }

    // TODO: Consider deleting associated files from Cloudinary if needed

    return res.status(200).json(
        new ApiResponse(200, { _id: franchiseId }, "Franchise deleted successfully")
    );
});

// Controller to resend franchise credentials
const resendFranchiseCredentials = asyncHandler(async (req, res) => {
    const { franchiseId } = req.params;
    if (!franchiseId) {
        throw new ApiError(400, "Franchise ID is required.");
    }

    const franchise = await Franchise.findById(franchiseId);
    if (!franchise) {
        throw new ApiError(404, "Franchise not found.");
    }

    // Generate a new temporary password
    const newRawPassword = generatePassword();
    const newHashedPassword = await bcrypt.hash(newRawPassword, 10);

    // Update the franchise's password in the database
    franchise.password = newHashedPassword;
    await franchise.save(); // Use save() to trigger pre-save hooks if any (though not strictly needed here)

    // Prepare email content
    const recipientEmail = franchise.email;
    const ownerName = franchise.ownerName;
    const loginId = franchise.franchiseId; // This is the system-generated ID, not email

    const subject = "Your SK Edutech Franchise Credentials";
    const textBody = `Hello ${ownerName},\n\nYour credentials for SK Edutech have been reset/resent.\n\nFranchise ID: ${loginId}\nNew Password: ${newRawPassword}\n\nPlease use these to log in.\n\nRegards,\nThe SK Edutech Team`;
    const htmlBody = `<p>Hello ${ownerName},</p><p>Your credentials for SK Edutech have been reset/resent.</p><p><b>Franchise ID:</b> ${loginId}<br><b>New Password:</b> ${newRawPassword}</p><p>Please use these to log in.</p><p>Regards,<br>The SK Edutech Team</p>`;

    try {
        await sendEmail(recipientEmail, subject, textBody, htmlBody);
        console.log(`--- Credentials Resent Successfully for ${recipientEmail} ---`);
        return res.status(200).json(
            new ApiResponse(200, {}, "Credentials resent successfully via email.")
        );
    } catch (emailError) {
        console.error(`!!! Failed to resend credentials email to ${recipientEmail}:`, emailError.message);
        // Even if email fails, the password was reset in DB.
        // Consider how to handle this - maybe a more specific error to frontend?
        throw new ApiError(500, "Password reset in database, but failed to send email. Please contact support.");
    }
});


// TODO: Add controller for checking and updating status based on expiry date (could be a scheduled job or checked on login/access)

// Export controllers
export {
    addFranchiseByAdmin, // Renamed from createFranchise
    applyForFranchise, // New placeholder
    getFranchiseRequests, // New
    updateFranchiseStatusVerification, // New
    getAllActiveFranchises, // Renamed from getAllFranchises
    getFranchiseById,    // New
    updateFranchiseById, // New
    deleteFranchiseById,  // New
    resendFranchiseCredentials // New
};
