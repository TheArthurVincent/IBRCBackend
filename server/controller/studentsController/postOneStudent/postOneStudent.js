const { Student_Model } = require("../../../models/Students");
const bcrypt = require("bcrypt");

/**
 * Função para registrar um novo aluno na base de dados.
 *
 * @param {*} req - Objeto de requisição contendo os dados do aluno a ser registrado.
 * @param {*} res - Objeto de resposta para enviar uma resposta HTTP.
 */
const student_postOne = async (req, res) => {
  const {
    email,
    name,
    lastname,
    doc,
    username,
    password,
    phoneNumber,
    dateOfBirth,
    googleDriveLink,
  } = req.body;

  // Hash da senha utilizando bcrypt
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Verificação se os campos obrigatórios estão presentes na requisição
  if (!email) {
    return res.status(500).json({ Erro: "email faltando", error });
  }
  if (!name) {
    return res.status(500).json({ Erro: "name faltando", error });
  }
  if (!lastname) {
    return res.status(500).json({ Erro: "lastname faltando", error });
  }
  if (!doc) {
    return res.status(500).json({ Erro: "doc faltando", error });
  }
  if (!password) {
    return res.status(500).json({ Erro: "password faltando", error });
  }
  if (!dateOfBirth) {
    return res.status(500).json({ Erro: "dateOfBirth faltando", error });
  }

  try {
    // Verifica se já existe um aluno com o mesmo email, documento ou username
    const existingStudent = await Student_Model.findOne({
      $or: [{ email: email }, { doc: doc }, { username: username }],
    });

    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Email, doc ou username já estão em uso" });
    }

    // Cria um novo objeto Student_Model com os dados fornecidos
    const newStudent = new Student_Model({
      // Define o username com base no valor fornecido ou combinação de nome e sobrenome sem espaços
      username: username
        ? username
        : (name + lastname.replace(/\s/g, "")).toLowerCase(),
      email,
      name,
      password: hashedPassword,
      lastname,
      doc,
      phoneNumber,
      dateOfBirth,
      // Define o link do Google Drive, caso não seja fornecido um link específico
      googleDriveLink: googleDriveLink
        ? googleDriveLink
        : "https://portal.arthurvincent.com.br/message",
    });

    // Salva o novo aluno na base de dados
    await newStudent.save();

    // Retorna uma resposta de sucesso com o status 201 e os dados do novo aluno
    res.status(201).json({
      status: "Aluno registrado",
      newStudent,
      username, // Retorna o username usado para registrar o aluno
    });
  } catch (error) {
    // Retorna uma resposta de erro caso ocorra algum problema durante o registro do aluno
    res.status(500).json({ Erro: "Aluno não registrado", error });
  }
};

module.exports = { student_postOne };
