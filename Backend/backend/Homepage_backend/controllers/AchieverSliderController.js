import Achievement from '../../Admin_Backend/models/Achievement/Achievement.model.js';
import Student from '../../Admin_Backend/models/Student/Student_Details.model.js'; // Adjust the path if needed

export const getAchievementsForLandingPage = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    // Fetch active achievements, sorted by date
    const achievements = await Achievement.find({ isActive: true })
      .sort({ date: -1 })
      .limit(limit);

    if (achievements.length === 0) {
      return res.status(200).json([]);
    }

    // Extract unique roll numbers
    const rollNumbers = [...new Set(achievements.map(a => a.rollNumber))];

    // Fetch students with those roll numbers
    const students = await Student.find(
      { rollNumber: { $in: rollNumbers } },
      { studentName: 1, studentPhoto: 1, studentSignature: 1, rollNumber: 1 }
    );

    // Create a lookup map
    const studentMap = {};
    students.forEach(student => {
      studentMap[student.rollNumber] = {
        studentName: student.studentName,
        studentPhoto: student.studentPhoto,
        studentSignature: student.studentSignature,
        rollNumber: student.rollNumber
      };
    });

    // Combine achievements with student details
    const achievementsWithStudents = achievements.map(achievement => {
      const student = studentMap[achievement.rollNumber] || null;

      return {
        id: achievement._id,
        achievementDetails: achievement.achievementDetails,
        date: achievement.date,
        rollNumber: achievement.rollNumber,
        studentName: student?.studentName || null,
        studentPhoto: student?.studentPhoto || null,
        studentSignature: student?.studentSignature || null
      };
    });

    res.status(200).json(achievementsWithStudents);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching achievements',
      error: error.message
    });
  }
};
