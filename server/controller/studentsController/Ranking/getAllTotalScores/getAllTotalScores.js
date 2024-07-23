const { Student_Model } = require("../../../../models/Students");

const students_getTotalAllScores = async (req, res) => {
  try {
    const students = await Student_Model.find();

    const filteredStudents = students.filter(
      (student) =>
        student._id.toString() !== "651311fac3d58753aa9281c5" &&
        student._id.toString() !== "658c9349adb27531cae962d3" &&
        student._id.toString() !== "6586ed9f7c72f31329eca797" &&
        student.totalScore > 0
    );

    const formattedStudentsData = filteredStudents.map((student, index) => {
      return {
        username: student.username,
        name: student.name,
        id: student._id,
        lastname: student.lastname,
        picture: student.picture,
        monthlyScore: student.monthlyScore,
        totalScore: student.totalScore,
      };
    });

    formattedStudentsData.sort((a, b) => b.totalScore - a.totalScore);
    res.status(200).json({ listOfStudents: formattedStudentsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Nenhum aluno / Erro no servidor", error });
  }
};

module.exports = { students_getTotalAllScores };
