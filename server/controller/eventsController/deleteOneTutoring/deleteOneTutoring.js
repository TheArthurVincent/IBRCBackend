const { Events_Model } = require("../../../models/Events");
const { Student_Model } = require("../../../models/Students");

/**
 * Controller para deletar uma sequência de tutoriais associados a um estudante e eventos relacionados.
 * 
 * @param {Object} req - O objeto de requisição Express contendo os dados necessários para a operação.
 * @param {Object} res - O objeto de resposta Express usado para retornar a resposta ao cliente.
 * @returns {Promise<void>} - Uma Promise que resolve quando a resposta for enviada.
 */
const event_Delete1SequenceOfTutorings = async (req, res) => {
    // Desestrutura os campos do corpo da requisição.
    const { id, studentID, day, time } = req.body;

    try {
        // Verifica se todos os parâmetros necessários foram fornecidos.
        if (!id || !studentID || !day || !time) {
            return res.status(400).json({ message: "Informações faltantes" });
        }

        // Busca o estudante pelo ID fornecido.
        const student = await Student_Model.findById(studentID);

        // Verifica se o estudante foi encontrado.
        if (!student) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        // Filtra os dias de tutoria do estudante para remover o tutorial com o ID fornecido.
        student.tutoringDays = student.tutoringDays.filter(
            (tutoring) => tutoring.id.toString() !== id
        );

        // Salva as alterações no estudante.
        await student.save();

        // Remove todos os eventos associados ao ID de tutoria fornecido.
        await Events_Model.deleteMany({
            tutoringID: id,
        });

        // Retorna uma resposta de sucesso com o estudante atualizado.
        return res.status(200).json({ student });
    } catch (error) {
        // Loga o erro para depuração.
        console.error(error);
        // Retorna uma resposta de erro com status 500 em caso de falha na operação.
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { event_Delete1SequenceOfTutorings };
