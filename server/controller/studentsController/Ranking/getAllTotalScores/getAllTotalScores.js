// Import necessary models
const { Student_Model } = require("../../../../models/Students");

/**
 * Controller function to retrieve total scores of all students except superadmins.
 * Retrieves all students from the database, filters out superadmins and students with total score <= 0,
 * formats the data, sorts by total score in descending order,
 * and sends the formatted student data in a JSON response.
 *
 * @param {Object} req - Express request object (unused in this function)
 * @param {Object} res - Express response object for sending JSON response
 */
const students_getTotalAllScores = async (req, res) => {
  try {
    // Retrieve all students from the database
    const students = await Student_Model.find();

    // Filter out students with 'superadmin' permissions and total score <= 0
    const filteredStudents = students.filter(
      (student) =>
        student.permissions !== "superadmin" && student.totalScore > 0
    );

    // Format student data for response
    const formattedStudentsData = filteredStudents.map((student, index) => {
      return {
        username: student.username,
        name: student.name,
        id: student._id,
        lastname: student.lastname,
        picture: student.picture,
        monthlyScore: student.monthlyScore,
        totalScore: student.totalScore,
      };
    });

    // Sort formatted data by total score in descending order
    formattedStudentsData.sort((a, b) => b.totalScore - a.totalScore);

    // Send success response with formatted student data
    res.status(200).json({ listOfStudents: formattedStudentsData });
  } catch (error) {
    // Handle errors during data retrieval or formatting
    console.error(error);
    res.status(500).json({ erro: "Nenhum aluno / Erro no servidor", error });
  }
};

// Export the controller function for use in routes
module.exports = { students_getTotalAllScores };
