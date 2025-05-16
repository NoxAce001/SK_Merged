// controllers/studentController.js
const Student = require("../models/Student")

exports.getRecentStudents = async (req, res) => {
  try {
    // Fetch recently joined students (sorted by creation date)
    // Limit to 10 students for the scrolling display
    const students = await Student.find()
      .select('studentName studentPhoto')
      .sort({ createdAt: -1 })
      .limit(10);
    
      console.log("come from database"  , students)
    // Transform the data to match the frontend requirements
    const formattedStudents = students.map(student => ({
      name: student.studentName,
      image: student.studentPhoto
    }));

    console.log("formated data :: " , formattedStudents)

    return res.status(200).json({
      success: true,
      message: "Recent students fetched successfully",
      data: formattedStudents
    });
  } catch (error) {
    console.error("Error fetching recent students:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent students",
      error: error.message
    });
  }
};



exports.getRecentCenterImgs = async (req, res) => {
  try {
    // Fetch recently joined students (sorted by creation date)
    // Limit to 10 students for the scrolling display
    const Centers = await Student.find()
      .select('studentName studentPhoto')
      .sort({ createdAt: -1 })
      .limit(10);
    
      console.log("come from database"  , Centers)
    // Transform the data to match the frontend requirements
    const formattedCenters = Centers.map(student => ({
      name: student.studentName,
      image: student.studentPhoto
    }));

    console.log("formated data :: " , formattedCenters)

    return res.status(200).json({
      success: true,
      message: "Recent students fetched successfully",
      data: formattedCenters
    });
  } catch (error) {
    console.error("Error fetching recent students:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent students",
      error: error.message
    });
  }
};