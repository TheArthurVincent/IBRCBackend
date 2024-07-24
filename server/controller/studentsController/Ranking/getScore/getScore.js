/**
 * Função assíncrona para obter a pontuação de um estudante.
 * @param {object} req - Objeto de requisição contendo os parâmetros da requisição.
 * @param {object} res - Objeto de resposta para enviar a resposta da requisição.
 * @returns {void}
 */
const { Student_Model } = require("../../../../models/Students");

const student_getScore = async (req, res) => {
    // Extrai o ID do parâmetro da requisição
    const { id } = req.params;

    try {
        // Procura o estudante pelo ID
        const student = await Student_Model.findById(id);
        if (!student) throw new Error("Usuário não encontrado");

        // Extrai os campos relevantes do estudante
        const { totalScore, monthlyScore, scoreTimeline, picture } = student;

        // Inverte a ordem do scoreTimeline para exibir do mais recente para o mais antigo
        scoreTimeline.reverse();

        // Responde com status 200 e um JSON contendo os dados de pontuação e imagem do estudante
        res.status(200).json({ totalScore, monthlyScore, scoreTimeline, picture });
    } catch (error) {
        // Em caso de erro, loga o erro no console e responde com status 500
        console.error(error);
        res
            .status(500)
            .json({ error: error, e: "Ocorreu um erro ao ver a pontuação" });
    }
};

module.exports = { student_getScore };
