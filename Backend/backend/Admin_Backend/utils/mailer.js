import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env' // Ensure .env file in backend root is loaded
});

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_PORT === '465', // true for 465, false for other ports like 587
    auth: {
        user: process.env.MAIL_USERNAME, // Your email service username
        pass: process.env.MAIL_PASSWORD, // Your email service password or App Password
    },
    // Optional: Add TLS options if needed, e.g., for self-signed certs
    // tls: {
    //     rejectUnauthorized: false // Use only for development/testing if necessary
    // }
});

/**
 * Sends an email.
 * @param {string} to Recipient email address.
 * @param {string} subject Email subject.
 * @param {string} text Plain text body.
 * @param {string} html HTML body (optional).
 * @returns {Promise<object>} Promise resolving with info object from Nodemailer.
 */
const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: `"${process.env.MAIL_FROM_NAME || 'SK Edutech Admin'}" <${process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body (optional)
    };

    try {
        console.log(`Attempting to send email to ${to} with subject "${subject}"`);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully: %s', info.messageId);
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // Only works with ethereal.email
        return info;
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        // Depending on the error, you might want to throw it or handle it differently
        // For now, just logging the error. In production, consider more robust error handling/retries.
        throw new Error(`Failed to send email. Error: ${error.message}`);
    }
};

export { sendEmail };
