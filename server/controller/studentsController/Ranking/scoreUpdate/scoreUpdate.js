/**
 * Função assíncrona para atualizar a pontuação de um estudante e registrar o histórico.
 * @param {object} req - Objeto de requisição contendo os parâmetros e corpo da requisição.
 * @param {object} res - Objeto de resposta para enviar a resposta da requisição.
 * @returns {void}
 */
const { Student_Model } = require("../../../../models/Students");

const student_scoreUpdate = async (req, res) => {
  // Extrai o ID do parâmetro da requisição
  const { id } = req.params;
  // Extrai score, description e type do corpo da requisição
  const { score, description, type } = req.body;

  // Converte score para um número
  theScore = new Number(score);

  try {
    // Procura o estudante pelo ID
    const student = await Student_Model.findById(id);
    if (!student) throw new Error("Usuário não encontrado");

    // Calcula os novos valores de pontuação total e mensal
    newTotalScore = student.totalScore + theScore;
    newMonthlyScore = student.monthlyScore + theScore;

    // Atualiza os campos de pontuação no objeto do estudante
    student.totalScore = newTotalScore;
    student.monthlyScore = newMonthlyScore;

    // Cria um objeto timeline para registrar o histórico da pontuação
    const timeline = {
      date: new Date(),
      score,
      description,
      type,
    };

    // Adiciona o objeto timeline ao array scoreTimeline do estudante
    student.scoreTimeline.push(timeline);

    // Salva as alterações no documento do estudante
    student.save();

    // Responde com status 200 e um JSON indicando sucesso
    res.status(200).json({ status: "success" });
  } catch (error) {
    // Em caso de erro, loga o erro no console e responde com status 500
    console.error(error);
    res
      .status(500)
      .json({ error: error, e: "Ocorreu um erro ao atualizar a pontuação" });
  }
};

module.exports = { student_scoreUpdate };
