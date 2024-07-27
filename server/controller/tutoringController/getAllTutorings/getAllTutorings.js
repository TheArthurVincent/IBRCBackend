const { Student_Model } = require("../../../models/Students");
const { Tutoring_Model } = require("../../../models/Tutoring");
const {
  deleteTutoringIfStudentsDoesnTExist,
} = require("./microservices/deleteTutoringIfStudentsDoesnTExist");

/**
 * Controller function to retrieve all tutorings grouped by students.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response indicating success or failure.
 */
const tutoring_getAll = async (req, res) => {
  try {
    // Fetch all tutorings and students
    const tutorings = await Tutoring_Model.find();
    const students = await Student_Model.find();

    // Initialize an object to store tutorings grouped by student
    const tutoringsByStudent = {};

    // Iterate through each tutoring to group them by student
    tutorings.forEach((tutoring) => {
      const studentID = tutoring.studentID;

      // Find the corresponding student for the tutoring
      const studentTheClassBelongsTo = students.find(
        (student) => student._id.toString() === studentID.toString()
      );

      // If student doesn't exist, delete the tutoring and return
      if (!studentTheClassBelongsTo) {
        deleteTutoringIfStudentsDoesnTExist(tutoring._id);
        return;
      }

      // If student exists, add tutoring to their group or create new group if not exists
      if (!tutoringsByStudent[studentID]) {
        tutoringsByStudent[studentID] = {
          student: {
            id: studentID,
            name:
              studentTheClassBelongsTo.name +
              " " +
              studentTheClassBelongsTo.lastname,
            username: studentTheClassBelongsTo.username,
          },
          tutorings: [],
        };
      }

      // Push tutoring details into the student's group
      tutoringsByStudent[studentID].tutorings.push({
        id: tutoring._id,
        title: tutoring.title,
        date: tutoring.date,
        videoUrl: tutoring.videoUrl,
        attachments: tutoring.attachments,
        createdAt: tutoring.createdAt,
        updatedAt: tutoring.updatedAt,
      });
    });

    // Convert grouped tutorings into array and filter out empty groups
    const formattedTutoringsByStudent = Object.values(
      tutoringsByStudent
    ).filter((group) => group.tutorings.length > 0);

    // Respond with formatted tutorings grouped by students
    res.status(200).json({
      status: "Aulas encontradas", // Success message
      formattedTutoringsByStudent, // Grouped tutorings by student
    });
  } catch (error) {
    console.log(error); // Log any errors
    res.status(500).json({ Erro: "Não há aulas registradas" }); // Error response if failed
  }
};

module.exports = { tutoring_getAll }; // Export the controller function
