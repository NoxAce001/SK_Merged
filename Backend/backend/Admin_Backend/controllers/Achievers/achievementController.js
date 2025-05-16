// // // Get a specific achievement by ID
// // export const getAchievementById = async (req, res) => {
// //   try {
// //     const achievement = await Achievement.findById(req.params.id);

// //     if (!achievement) {
// //       return res.status(404).json({ message: 'Achievement not found' });
// //     }

// //     const student = await Student.findOne({ rollNumber: achievement.rollNumber });

// //     res.status(200).json({
// //       ...achievement._doc,
// //       studentDetails: student ? {
// //         name: student.name,
// //         image: student.image,
// //         rollNumber: student.rollNumber
// //       } : null
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error fetching achievement', error: error.message });
// //   }
// // };

// // // Update an achievement
// // export const updateAchievement = async (req, res) => {
// //   try {
// //     const { rollNumber, achievementDetails } = req.body;

// //     if (rollNumber) {
// //       const student = await Student.findOne({ rollNumber });
// //       if (!student) {
// //         return res.status(404).json({ message: 'Student with this roll number does not exist' });
// //       }
// //     }

// //     const updatedAchievement = await Achievement.findByIdAndUpdate(
// //       req.params.id,
// //       { rollNumber, achievementDetails },
// //       { new: true, runValidators: true }
// //     );

// //     if (!updatedAchievement) {
// //       return res.status(404).json({ message: 'Achievement not found' });
// //     }

// //     res.status(200).json(updatedAchievement);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error updating achievement', error: error.message });
// //   }
// // };

// // // Get achievements by student roll number
// // export const getAchievementsByRollNumber = async (req, res) => {
// //   try {
// //     const { rollNumber } = req.params;

// //     const student = await Student.findOne({ rollNumber });
// //     if (!student) {
// //       return res.status(404).json({ message: 'Student not found' });
// //     }

// //     const achievements = await Achievement.find({ 
// //       rollNumber,
// //       isActive: true 
// //     });

// //     res.status(200).json({
// //       studentDetails: {
// //         name: student.name,
// //         image: student.image,
// //         rollNumber: student.rollNumber
// //       },
// //       achievements
// //     });
// //   } catch (error) {
// //     res.status(500).json({ 
// //       message: 'Error fetching achievements for student', 
// //       error: error.message 
// //     });
// //   }
// // };


import Achievement from '../../models/Achievement/Achievement.model.js'
import Student from '../../models/Student/Student_Details.model.js';

// Get all achievements (with limit enforcement)
export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true });
    
    res.status(200).json({
      success: true,
      count: achievements.length,
      achievements: achievements,
      remainingSlots: Math.max(0, 10 - achievements.length)
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching achievements', 
      error: error.message 
    });
  }
};

// Add multiple achievements with total limit enforcement
export const addAchievement = async (req, res) => {
  try {
    // Ensure we have an array to work with
    const achievementsData = Array.isArray(req.body) ? req.body : [req.body];
    
    // Check how many achievements already exist in the database
    const existingCount = await Achievement.countDocuments({ isActive: true });
    
    // Calculate how many more can be added
    const remainingSlots = Math.max(0, 10 - existingCount);
    
    if (remainingSlots === 0) {
      return res.status(400).json({ 
        message: 'Maximum limit of 10 achievements already reached',
        count: existingCount
      });
    }
    
    // Limit the number of entries that can be added
    if (achievementsData.length > remainingSlots) {
      return res.status(400).json({ 
        message: `Only ${remainingSlots} more achievements can be added to reach the limit of 10`,
        count: existingCount,
        remainingSlots: remainingSlots
      });
    }
    
    if (achievementsData.length === 0) {
      return res.status(400).json({ message: 'No achievements provided' });
    }

    // Extract all unique roll numbers from the request
    const uniqueRollNumbers = [...new Set(achievementsData.map(item => item.rollNumber))];
    
    // Fetch all students in one query
    const students = await Student.find({ rollNumber: { $in: uniqueRollNumbers } });
    
    // Create a map for faster lookups
    const studentMap = {};
    students.forEach(student => {
      studentMap[student.rollNumber] = student;
    });
    
    // Validate all achievements and prepare valid ones for insertion
    const validAchievements = [];
    const invalidEntries = [];
    
    achievementsData.forEach(data => {
      if (!data.rollNumber || !data.achievementDetails) {
        invalidEntries.push({
          data,
          error: 'Missing required fields: rollNumber or achievementDetails'
        });
        return;
      }
      
      // Check if student exists
      if (!studentMap[data.rollNumber]) {
        invalidEntries.push({
          data,
          error: `Student with roll number ${data.rollNumber} does not exist`
        });
        return;
      }
      
      // Add to valid achievements
      validAchievements.push({
        rollNumber: data.rollNumber,
        achievementDetails: data.achievementDetails,
        date: new Date(),
        isActive: true
      });
    });
    
    // If no valid achievements, return error
    if (validAchievements.length === 0) {
      return res.status(400).json({
        message: 'No valid achievements to add',
        errors: invalidEntries
      });
    }
    
    // Insert all valid achievements in one operation
    const savedAchievements = await Achievement.insertMany(validAchievements);
    
    // Get updated count
    const newTotalCount = existingCount + savedAchievements.length;
    
    // Return success response with details
    res.status(201).json({
      success: true,
      achievementsAdded: savedAchievements.length,
      achievements: savedAchievements,
      totalCount: newTotalCount,
      remainingSlots: Math.max(0, 10 - newTotalCount),
      errors: invalidEntries.length > 0 ? invalidEntries : undefined
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding achievements', 
      error: error.message 
    });
  }
};

// Soft delete an achievement
export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    // Get updated count after deletion
    const remainingCount = await Achievement.countDocuments({ isActive: true });

    res.status(200).json({ 
      message: 'Achievement deleted successfully',
      remainingCount: remainingCount,
      remainingSlots: Math.max(0, 10 - remainingCount)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting achievement', error: error.message });
  }
};
