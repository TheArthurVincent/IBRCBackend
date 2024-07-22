// Import necessary models and libraries
const { Student_Model } = require("../../../models/Students");

const students_getAll = async (req, res) => {
  try {
    // Retrieve all students from the database
    const students = await Student_Model.find();

    // Format student data for response, including sorting alphabetically by name
    const formattedStudentsData = students.map((student, index) => {
      return {
        position: index, // Index position in the array
        id: student._id,
        username: student.username,
        email: student.email,
        name: student.name,
        address: student.address,
        lastname: student.lastname,
        password: student.password,
        dateOfBirth: student.dateOfBirth,
        fullname: student.name + " " + student.lastname, // Full name
        permissions: student.permissions,
        doc: student.doc,
        weeklyClasses: student.weeklyClasses,
        totalScore: student.totalScore,
        monthlyScore: student.monthlyScore,
        phoneNumber: student.phoneNumber,
        googleDriveLink: student.googleDriveLink,
        picture: student.picture,
        fee: student.fee,
      };
    });

    // Sort formatted data alphabetically by student name
    formattedStudentsData.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    // Send success response with formatted student data
    res.status(200).json({
      status: `Success! ${students.length} students found.`,
      listOfStudents: formattedStudentsData,
    });
  } catch (error) {
    // Handle errors during data retrieval or formatting
    console.error(error);
    res
      .status(500)
      .json({ error: "No students / Server error", details: error });
  }
};

module.exports = { students_getAll };
