const { CourseInfo_Model } = require("../../../models/CourseClass");
const { Student_Model } = require("../../../models/Students");
const bcrypt = require("bcrypt");

const student_signUp = async (req, res) => {
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
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const existingStudent = await Student_Model.findOne({
      $or: [{ email: email }, { doc: doc }, { username: username }],
    });

    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Email, doc ou username já estão em uso" });
    }

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
    await newStudent.save();

    const englishGrammarCourse = await CourseInfo_Model.findById(
      "667a9dd14648eac1993646fc"
    );

    englishGrammarCourse.studentsWhoHaveAccessToIt.push(newStudent.id);
    englishGrammarCourse.save();

    res.status(201).json({
      status: "Aluno registrado",
      newStudent,
    });
  } catch (error) {
    res.status(500).json({ Erro: "Aluno não registrado", error });
  }
};

module.exports = { student_signUp, };
