import Student from "../../Admin_Backend/models/Student/Student_Details.model.js";

export const getRecentStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select('studentName studentPhoto')
      .sort({ createdAt: -1 })
      .limit(10);

    console.log("come from database:", students);

    const formattedStudents = students.map(student => ({
      name: student.studentName,
      image: student.studentPhoto
    }));

    console.log("formatted data:", formattedStudents);

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

export const getRecentCenterImgs = async (req, res) => {
  try {
    const Centers = await Student.find()
      .select('studentName studentPhoto')
      .sort({ createdAt: -1 })
      .limit(10);

    console.log("come from database:", Centers);

    const formattedCenters = Centers.map(student => ({
      name: student.studentName,
      image: student.studentPhoto
    }));

    console.log("formatted data:", formattedCenters);

    return res.status(200).json({
      success: true,
      message: "Recent center images fetched successfully",
      data: formattedCenters
    });
  } catch (error) {
    console.error("Error fetching recent center images:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent center images",
      error: error.message
    });
  }
};
