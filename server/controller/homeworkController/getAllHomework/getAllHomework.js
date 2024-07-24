/**
 * Get all homework assignments for a student, including tutoring and group class homework.
 * @param {object} req - Express request object containing parameters.
 * @param {object} res - Express response object for sending responses.
 * @returns {object} JSON response with lists of tutoring and group class homework.
 */
const { Homework_Model } = require("../../../models/Homework");
const { Student_Model } = require("../../../models/Students");

const homework_getAll = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the student by ID
    const student = await Student_Model.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Estudante não encontrado" });
    }

    // Find all tutoring homework for the student
    const tutoringHomework = await Homework_Model.find({ studentID: id });
    // Find all group class homework
    const groupClassHomework = await Homework_Model.find({
      category: "groupclass",
    });

    // Sort tutoring homework by assignment date
    const tutoringHomeworkList = tutoringHomework.sort(
      (a, b) => new Date(a.assignmentDate) - new Date(b.assignmentDate)
    );

    // Update status of group class homework based on whether student has done it
    const updatedGroupClassHomeworkList = groupClassHomework
      .map((homework) => {
        const isDone = homework.studentsWhoDidIt.includes(id);
        return { ...homework._doc, status: isDone ? "done" : "pending" };
      })
      .sort((a, b) => new Date(a.assignmentDate) - new Date(b.assignmentDate));

    // Reverse lists for display if needed
    tutoringHomeworkList.reverse();
    updatedGroupClassHomeworkList.reverse();

    // Send response with both lists
    res.status(200).json({
      tutoringHomeworkList,
      groupClassHomeworkList: updatedGroupClassHomeworkList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nenhum homework encontrado" });
  }
};

module.exports = { homework_getAll };
