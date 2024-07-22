const { Student_Model } = require("../models/Students");
const bcrypt = require("bcrypt");
const { HistoryRanking_Model } = require("../models/HistoryRanking");

const students_getAllScores = async (req, res) => {
  try {
    const students = await Student_Model.find();

    const filteredStudents = students.filter(
      (student) =>
        student._id.toString() !== "651311fac3d58753aa9281c5" &&
        student._id.toString() !== "658c9349adb27531cae962d3"
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

    formattedStudentsData.sort((a, b) => b.monthlyScore - a.monthlyScore);
    res.status(200).json({ listOfStudents: formattedStudentsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Nenhum aluno / Erro no servidor", error });
  }
};

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


const students_getOneFullName = async (req, res) => {
  try {
    const student = await Student_Model.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }
    const name = student.name + " " + student.lastname;
    res.status(200).json({
      status: "Nome encontrado",
      name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Nenhum aluno encontrado!", status: error });
  }
};

const student_postOne = async (req, res) => {
  const {
    username,
    email,
    password,
    name,
    lastname,
    doc,
    phoneNumber,
    dateOfBirth,
    // ankiEmail,
    // ankiPassword,
    googleDriveLink,
    date,
    time,
    link,
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
      username,
      email,
      name,
      password: hashedPassword,
      lastname,
      doc,
      phoneNumber,
      dateOfBirth,
      // ankiEmail,
      // ankiPassword,
      googleDriveLink,
      nextClass: { date, time, link },
    });

    await newStudent.save();

    res.status(201).json({
      status: "Aluno registrado",
      newStudent,
      username,
    });
  } catch (error) {
    res.status(500).json({ Erro: "Aluno não registrado", error });
  }
};

const student_editGeneralData = async (req, res) => {
  const {
    name,
    lastname,
    username,
    email,
    fee,
    address,
    weeklyClasses,
    googleDriveLink,
    picture,
    phoneNumber,
  } = req.body;

  const numberFee = parseInt(fee);
  try {
    const { id } = req.params;
    const studentToEdit = await Student_Model.findById(id);
    if (!studentToEdit) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    } else if (!username || !email || !name || !lastname || !phoneNumber) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    } else if (
      // studentToEdit.ankiEmail === ankiEmail &&
      // studentToEdit.ankiPassword === ankiPassword &&
      studentToEdit.name === name &&
      studentToEdit.lastname === lastname &&
      studentToEdit.username === username &&
      studentToEdit.email === email &&
      studentToEdit.picture === picture &&
      studentToEdit.weeklyClasses === weeklyClasses &&
      studentToEdit.address === address &&
      studentToEdit.googleDriveLink === googleDriveLink &&
      studentToEdit.fee === numberFee &&
      studentToEdit.phoneNumber === phoneNumber
    ) {
      res.json({
        message: `Nenhuma edição feita no usuário ${studentToEdit.username}`,
      });
    } else {
      studentToEdit.name = name;
      studentToEdit.lastname = lastname;
      studentToEdit.username = username;
      studentToEdit.email = email;
      studentToEdit.googleDriveLink = googleDriveLink;
      studentToEdit.weeklyClasses = weeklyClasses;
      studentToEdit.picture = picture;
      studentToEdit.address = address;
      studentToEdit.fee = numberFee;
      studentToEdit.phoneNumber = phoneNumber;

      await studentToEdit.save();

      res.status(200).json({
        message: "Aluno editado com sucesso",
        updatedUser: studentToEdit,
      });
    }
  } catch (error) {
    res.status(500).send("Erro ao editar aluno");
  }
};

const student_editPersonalPassword = async (req, res) => {
  const { newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  try {
    const { id } = req.params;
    const studentWhosePasswordYouWantToChange = await Student_Model.findById(
      id
    );

    if (!studentWhosePasswordYouWantToChange) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    } else if (!hashedPassword) {
      return res.status(400).json({ message: "Escolha uma nova senha" });
    } else if (
      studentWhosePasswordYouWantToChange.password === hashedPassword
    ) {
      res.json({
        message: `Escolha uma senha diferente para ${studentWhosePasswordYouWantToChange.username}`,
      });
    } else {
      studentWhosePasswordYouWantToChange.password = hashedPassword;
      await studentWhosePasswordYouWantToChange.save();

      res.status(200).json({
        message: "Senha edtada com sucesso",
        updatedUser: studentWhosePasswordYouWantToChange,
      });
      console.log(studentWhosePasswordYouWantToChange);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao editar aluno");
  }
};

const student_editPassword = async (req, res) => {
  const { newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  try {
    const { id } = req.params;
    const studentWhosePasswordYouWantToChange = await Student_Model.findById(
      id
    );

    if (!studentWhosePasswordYouWantToChange) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    } else if (!hashedPassword) {
      return res.status(400).json({ message: "Escolha uma nova senha" });
    } else if (
      studentWhosePasswordYouWantToChange.password === hashedPassword
    ) {
      res.json({
        message: `Escolha uma senha diferente para ${studentWhosePasswordYouWantToChange.username}`,
      });
    } else {
      studentWhosePasswordYouWantToChange.password = hashedPassword;
      await studentWhosePasswordYouWantToChange.save();

      res.status(200).json({
        message: "Senha edtada com sucesso",
        updatedUser: studentWhosePasswordYouWantToChange,
      });
      console.error(studentWhosePasswordYouWantToChange);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao editar aluno");
  }
};

const student_editPermissions = async (req, res) => {
  const { permissions } = req.body;
  try {
    const { id } = req.params;
    const studentWhosePermissionsToEdit = await Student_Model.findById(id);
    if (!studentWhosePermissionsToEdit) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    } else if (!permissions) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    } else if (studentWhosePermissionsToEdit.permissions === permissions) {
      res.json({
        message: `Nenhuma edição de permissões feita no usuário ${studentWhosePermissionsToEdit.username}`,
      });
    } else {
      studentWhosePermissionsToEdit.permissions = permissions;

      await studentWhosePermissionsToEdit.save();

      res.status(200).json({
        message: "Permissões do aluno editadas com sucesso",
        updatedUser: studentWhosePermissionsToEdit,
      });
      console.error(studentWhosePermissionsToEdit);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao editar permissões do aluno");
  }
};

const student_deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    } else {
      await student.deleteOne();
      res.status(200).json({
        status: "Aluno excluído com sucesso",
      });
    }
  } catch (error) {
    res.status(500).json({ erro: "Falha ao excluir aluno!", status: error });
  }
};

////////// Scores
const student_seeScore = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student_Model.findById(id);
    if (!student) throw new Error("Usuário não encontrado");

    const { totalScore, monthlyScore } = student;
    res.status(200).json({ totalScore, monthlyScore, picture });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error, e: "Ocorreu um erro ao ver a pontuação" });
  }
};

const student_getScore = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student_Model.findById(id);
    if (!student) throw new Error("Usuário não encontrado");

    const { totalScore, monthlyScore, scoreTimeline, picture } = student;
    scoreTimeline.reverse();
    res.status(200).json({ totalScore, monthlyScore, scoreTimeline, picture });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error, e: "Ocorreu um erro ao ver a pontuação" });
  }
};

const student_scoreUpdate = async (req, res) => {
  const { id } = req.params;
  const { score, description, type } = req.body;

  theScore = new Number(score);

  try {
    const student = await Student_Model.findById(id);
    if (!student) throw new Error("Usuário não encontrado");

    newTotalScore = student.totalScore + theScore;
    newMonthlyScore = student.monthlyScore + theScore;

    student.totalScore = newTotalScore;
    student.monthlyScore = newMonthlyScore;

    const timeline = {
      date: new Date(),
      score,
      description,
      type,
    };

    student.scoreTimeline.push(timeline);

    student.save();
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error, e: "Ocorreu um erro ao atualizar a pontuação" });
  }
};

const student_resetMonth = async (req, res) => {
  try {
    const students = await Student_Model.find();
    const master = await Student_Model.findById("651311fac3d58753aa9281c5");

    students.map((student) => {
      student.monthlyScore = 0;
      student.totalScore < 0 ? (student.totalScore = 0) : null;
      student.save();
    });

    master.totalScore = 2000000;
    master.save();
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error, e: "Ocorreu um erro ao atualizar a pontuação" });
  }
};

const student_newRankingItem = async (req, res) => {
  const { scoreMonth } = req.body;
  try {
    if (scoreMonth) {
      const score = new HistoryRanking_Model({ score: scoreMonth });
      score.save();
      res.status(200).json({ score, message: "Sucesso" });
    } else {
      res.status(500).json({ error: error, e: "Ocorreu um erro " });
      throw new Error();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error, e: "Ocorreu um erro " });
  }
};

const student_getallRankingItem = async (req, res) => {
  try {
    const scoreMonth = await HistoryRanking_Model.find();
    res
      .status(200)
      .json({ scoreMonth: scoreMonth.reverse(), message: "Sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error, e: "Ocorreu um erro " });
  }
};

module.exports = {
  //C
  student_postOne,
  student_newRankingItem,
  //R
  student_getallRankingItem,
  students_getOneFullName,
  students_getAllScores,
  students_getTotalAllScores,
  student_scoreUpdate,
  student_seeScore,
  student_getScore,
  student_resetMonth,
  //U
  student_editGeneralData,
  student_editPassword,
  student_editPersonalPassword,
  student_editPermissions,
  //D
  student_deleteOne,
};
