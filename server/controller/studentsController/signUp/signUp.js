const {
  addStudentToCourse,
} = require("./microservices/registerCourseInTheActOfRegistration");
const { registerStudent } = require("./microservices/registerStudent");

/**
 * Controller function for handling student sign-up.
 * This function registers a new student and adds them to a specific course.
 *
 * @param {Object} req - Express request object containing student data in req.body
 * @param {Object} res - Express response object for sending HTTP responses
 * @returns {Promise<void>} - Promise representing the asynchronous operation
 */
const student_signUp = async (req, res) => {
  try {
    // Register a new student using data from the request body
    const newStudent = await registerStudent(req.body);

    // Add the newly registered student to a predefined course
    await addStudentToCourse(newStudent.id, "667a9dd14648eac1993646fc");

    // Respond with HTTP status 201 Created and JSON indicating success
    res.status(201).json({ status: "Aluno registrado", newStudent });
  } catch (error) {
    // If an error occurs during student registration or course addition, handle it
    res
      .status(500)
      .json({ Erro: "Aluno não registrado", error: error.message });
  }
};

module.exports = { student_signUp };
