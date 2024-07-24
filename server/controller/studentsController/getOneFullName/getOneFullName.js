/**
 * Função assíncrona para obter o nome completo de um estudante pelo ID.
 * @param {object} req - Objeto de requisição contendo os parâmetros da requisição.
 * @param {object} res - Objeto de resposta para enviar a resposta da requisição.
 * @returns {void}
 */
const { Student_Model } = require("../../../models/Students");

const students_getOneFullName = async (req, res) => {
    try {
        // Busca o estudante pelo ID fornecido na requisição
        const student = await Student_Model.findById(req.params.id);
        if (!student) {
            // Retorna um status 404 e um JSON indicando que o aluno não foi encontrado
            return res.status(404).json({ message: "Aluno não encontrado" });
        }
        // Concatena o nome e sobrenome do estudante
        const name = student.name + " " + student.lastname;

        // Responde com status 200 e um JSON contendo o nome completo do estudante
        res.status(200).json({
            status: "Nome encontrado",
            name,
        });
    } catch (error) {
        // Em caso de erro, loga o erro no console e responde com status 500
        console.error(error);
        res.status(500).json({ erro: "Nenhum aluno encontrado!", status: error });
    }
};

module.exports = { students_getOneFullName };
