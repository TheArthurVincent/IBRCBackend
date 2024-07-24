// Import necessary models
const { Student_Model } = require("../../../../models/Students");

/**
 * Controller function to reset monthly and total scores of all students.
 * Retrieves all students from the database, resets monthly scores to 0,
 * sets total scores to 0 if they are negative, and saves the updated student documents.
 *
 * @param {Object} req - Express request object (unused in this function)
 * @param {Object} res - Express response object for sending JSON response
 */
const student_resetMonth = async (req, res) => {
  try {
    // Retrieve all students from the database
    const students = await Student_Model.find();

    // Reset monthly and total scores for each student
    students.map((student) => {
      student.monthlyScore = 0; // Reset monthly score to 0
      if (student.totalScore < 0) {
        student.totalScore = 0; // Set total score to 0 if it's negative
      }
      student.save(); // Save the updated student document
    });

    // Send success response
    res.status(200).json({ status: "success" });
  } catch (error) {
    // Handle errors during data update
    console.error(error);
    res
      .status(500)
      .json({ error: error, e: "Ocorreu um erro ao atualizar a pontuação" });
  }
};

// Export the controller function for use in routes
module.exports = { student_resetMonth };
