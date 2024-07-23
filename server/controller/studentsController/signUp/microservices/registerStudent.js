const bcrypt = require("bcrypt");
const { Student_Model } = require("../../../../models/Students");

/**
 * Registers a new student in the database after hashing their password.
 *
 * @param {Object} studentData - Data object containing student information
 * @returns {Promise<Object>} - Promise resolving to the newly registered student object
 * @throws {Error} - Throws an error if the email or document number is already in use
 */
const registerStudent = async (studentData) => {
  // Destructure studentData object for required fields
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
  } = studentData;

  // Hash the provided password using bcrypt with salt rounds of 10
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Check if a student with the same email or document number already exists
  const existingStudent = await Student_Model.findOne({
    $or: [{ email: email }, { doc: doc }],
  });

  // If a student with the same email or doc already exists, throw an error
  if (existingStudent) {
    throw new Error("Email ou doc já estão em uso");
  }

  // Create a new instance of Student_Model with hashed password
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

  // Return the newly registered student object
  return newStudent;
};

module.exports = { registerStudent };
