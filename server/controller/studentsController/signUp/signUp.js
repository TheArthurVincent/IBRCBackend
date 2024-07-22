// Import necessary models and libraries
const { CourseInfo_Model } = require("../../../models/CourseClass");
const { Student_Model } = require("../../../models/Students");
const bcrypt = require("bcrypt");

// Function to handle student registration
const student_signUp = async (req, res) => {
  // Destructure student details from request body
  const {
    name,
    lastname,
    username,
    phoneNumber,
    email,
    dateOfBirth,
    doc,
    address,
    password,
  } = req.body;

  // Hash the password using bcrypt
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    // Check if there is already a student with the same email, doc, or username
    const existingStudent = await Student_Model.findOne({
      $or: [{ email: email }, { doc: doc }, { username: username }],
    });

    // If a student with the same email, doc, or username exists, return an error
    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Email, doc ou username já estão em uso" });
    }

    // Create a new instance of Student_Model with hashed password and other details
    const newStudent = new Student_Model({
      name,
      lastname,
      username,
      phoneNumber,
      email,
      dateOfBirth,
      doc,
      address,
      password: hashedPassword,
    });

    // Save the new student to the database
    await newStudent.save();

    // Find the English Grammar course by its ID
    const englishGrammarCourse = await CourseInfo_Model.findById(
      "667a9dd14648eac1993646fc"
    );

    // Add the new student's ID to the course's list of students
    englishGrammarCourse.studentsWhoHaveAccessToIt.push(newStudent.id);
    // Save the updated course information
    await englishGrammarCourse.save();

    // Respond with status 201 and the registered student's details
    res.status(201).json({
      status: "Aluno registrado",
      newStudent,
    });
  } catch (error) {
    // If an error occurs during registration, respond with status 500 and the error details
    res.status(500).json({ Erro: "Aluno não registrado", error });
  }
};

// Export the student_signUp function to be used by other modules
module.exports = { student_signUp };
