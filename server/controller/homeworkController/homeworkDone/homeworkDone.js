const { Homework_Model } = require("../../../models/Homework");
const { Student_Model } = require("../../../models/Students");

const homework_done = async (req, res) => {
  const { id } = req.params;
  const { tutoringId, score } = req.body;

  try {
    const student = await Student_Model.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Estudante não encontrado" });
    }

    const tutoringHomework = await Homework_Model.findById(tutoringId);
    if (tutoringHomework && tutoringHomework.studentID == id) {
      tutoringHomework.status = "done";
      await tutoringHomework.save();

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
      const groupClassHomework = await Homework_Model.findById(tutoringId);
      if (groupClassHomework) {
        groupClassHomework.studentsWhoDidIt.push(id);
        await groupClassHomework.save();

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
