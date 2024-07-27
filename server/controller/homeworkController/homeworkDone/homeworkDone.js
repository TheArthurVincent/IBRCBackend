/**
 * Mark homework as done for a student, updating scores and timelines.
 * @param {object} req - Express request object containing parameters and body.
 * @param {object} res - Express response object for sending responses.
 * @returns {object} JSON response indicating success or error.
 */
const { Homework_Model } = require("../../../models/Homework");
const { Student_Model } = require("../../../models/Students");

const homework_done = async (req, res) => {
  const { id } = req.params;
  const { tutoringId, score } = req.body;

  try {
    // Find the student by ID
    const student = await Student_Model.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Estudante não encontrado" });
    }

    // Check if it's a tutoring homework
    const tutoringHomework = await Homework_Model.findById(tutoringId);
    if (tutoringHomework && tutoringHomework.studentID == id) {
      // Update tutoring homework status to "done"
      tutoringHomework.status = "done";
      await tutoringHomework.save();

      // Update student's score and score timeline
      const timeline = {
        date: new Date(),
        score,
        description: "Homework done",
        type: "Tutoring",
      };
      student.scoreTimeline.push(timeline);
      student.monthlyScore += score;
      student.totalScore += score;
      await student.save();
    } else {
      // If not a tutoring homework, check if it's a group class homework
      const groupClassHomework = await Homework_Model.findById(tutoringId);
      if (groupClassHomework) {
        // Add student to the list of students who did the group class homework
        groupClassHomework.studentsWhoDidIt.push(id);
        await groupClassHomework.save();

        // Update student's score and score timeline for group class homework
        const timeline = {
          date: new Date(),
          score,
          description: "Group class homework done",
          type: "Group class",
        };
        student.scoreTimeline.push(timeline);
        student.monthlyScore += score;
        student.totalScore += score;
        await student.save();
      }
    }

    res.status(200).json("success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nenhum homework encontrado" });
  }
};

module.exports = { homework_done };
