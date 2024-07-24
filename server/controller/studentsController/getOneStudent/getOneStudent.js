// Import necessary models and libraries
const { Student_Model } = require("../../../models/Students");

/**
 * Controller function to retrieve a single student by ID from the database.
 * It fetches student data based on the provided ID, formats it, and sends it as a JSON response.
 *
 * @param {Object} req - Express request object containing the student ID in params
 * @param {Object} res - Express response object for sending JSON response
 */
const students_getOne = async (req, res) => {
  try {
    // Find student by ID in the database
    const student = await Student_Model.findById(req.params.id);

    // If no student found with the given ID, return 404 Not Found
    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    // Format student data for response
    const formattedStudentData = {
      id: student._id,
      username: student.username,
      email: student.email,
      name: student.name,
      lastname: student.lastname,
      fullname: student.name + " " + student.lastname, // Full name
      permissions: student.permissions,
      doc: student.doc,
      address: student.address,
      phoneNumber: student.phoneNumber,
      picture: student.picture,
      dateOfBirth: student.dateOfBirth,
      weeklyClasses: student.weeklyClasses,
      monthlyScore: student.monthlyScore,
      googleDriveLink: student.googleDriveLink,
      totalScore: student.totalScore,
      fee: student.fee,
    };

    // Send success response with formatted student data
    res.status(200).json({
      status: "Aluno encontrado",
      formattedStudentData,
    });
  } catch (error) {
    // Handle errors during data retrieval or formatting
    console.error(error);
    res.status(500).json({ erro: "Nenhum aluno encontrado!", status: error });
  }
};

// Export the controller function for use in routes
module.exports = { students_getOne };
