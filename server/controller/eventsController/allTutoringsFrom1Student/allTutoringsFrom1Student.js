const { Student_Model } = require("../../../models/Students");

/**
 * Controller para visualizar todos os dias de tutoria de um estudante específico.
 * 
 * @param {Object} req - O objeto de requisição Express, contendo o ID do estudante nos parâmetros da URL.
 * @param {Object} res - O objeto de resposta Express usado para retornar a resposta ao cliente.
 * @returns {Promise<void>} - Uma Promise que resolve quando a resposta for enviada.
 */
const events_seeAllTutoringsFrom1Student = async (req, res) => {
    // Obtém o ID do estudante a partir dos parâmetros da requisição.
    const { studentId } = req.params;

    try {
        // Verifica se o ID do estudante foi fornecido.
        if (!studentId) {
            // Retorna uma resposta de erro 400 (Bad Request) se o ID estiver faltando.
            return res.status(400).json({ message: "Informações faltantes" });
        }

        // Busca o estudante pelo ID fornecido.
        const student = await Student_Model.findById(studentId);

        // Verifica se o estudante foi encontrado.
        if (!student) {
            // Retorna uma resposta de erro 404 (Not Found) se o estudante não for encontrado.
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        // Obtém todos os dias de tutoria do estudante.
        const tutorings = student.tutoringDays;

        // Retorna uma resposta de sucesso com os dias de tutoria do estudante.
        return res.status(200).json({ tutorings });
    } catch (error) {
        // Em caso de erro na operação, retorna uma resposta de erro 500 (Internal Server Error).
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { events_seeAllTutoringsFrom1Student };
