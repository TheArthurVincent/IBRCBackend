// Import necessary models and libraries
const { Student_Model } = require("../../../models/Students");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
console.log("process.env.SECRET", process.env.SECRET)
console.log("process.env.UNIVERSAL", process.env.UNIVERSAL)

/**
 * Controller function to handle student login.
 * Attempts to authenticate a student based on provided email and password.
 * If successful, generates a JWT token for session management.
 *
 * @param {Object} req - Express request object containing email and password in body
 * @param {Object} res - Express response object for sending JSON response
*/
const student_login = async (req, res) => {
  const { email, password } = req.body;

  // Universal password used if no password is provided in the request

  if (!password) {
    // Set default password if not provided
    return res.status(400).json("Digite sua senha"); // Portuguese for "Enter your password"
  } else if (!email) {
    // Return error if email is missing
    return res.status(400).json("Digite seu e-mail"); // Portuguese for "Enter your email"
  }

  try {
    // Attempt to find student in the database by email
    const student = await Student_Model.findOne({ email: email });

    if (!student) throw new Error("Usuário não encontrado"); // Portuguese for "User not found"

    // Check if the provided password matches the stored password or universal password
    const isUniversalPassword = password === process.env.UNIVERSAL;

    if (
      !(await bcrypt.compare(password, student.password)) &&
      !isUniversalPassword
    )
      throw new Error("Senha incorreta"); // Portuguese for "Incorrect password"

    // Generate JWT token for authenticated student session
    const token = jwt.sign({ id: student._id }, process.env.SECRET, {
      expiresIn: '1d',
    });


    // Logged-in student data to send in response
    const loggedIn = {
      id: student._id,
      username: student.username,
      email: student.email,
      name: student.name,
      lastname: student.lastname,
      doc: student.doc,
      totalScore: student.totalScore,
      monthlyScore: student.monthlyScore,
      phoneNumber: student.phoneNumber,
      dateOfBirth: student.dateOfBirth,
      permissions: student.permissions,
      picture: student.picture,
      googleDriveLink: student.googleDriveLink,
    };

    // Send success response with token and logged-in student data
    res.status(200).json({ token: token, loggedIn: loggedIn });
  } catch (error) {
    // Handle errors during login process
    console.error(error);
    res.status(500).json({ error: error, e: "Ocorreu um erro ao fazer login" }); // Portuguese for "An error occurred while logging in"
  }
};

// Export the controller function for use in routes
module.exports = { student_login };
