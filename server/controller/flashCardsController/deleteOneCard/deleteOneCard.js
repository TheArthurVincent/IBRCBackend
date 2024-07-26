const { Student_Model } = require("../../../models/Students");

/**
 * Remove um flashcard específico de um estudante.
 * 
 * @param {Object} req - O objeto de solicitação da HTTP.
 * @param {Object} res - O objeto de resposta da HTTP.
 * @returns {Object} - Retorna uma resposta JSON com o status da operação.
 */
const flashcard_delete1Card = async (req, res) => {
    // Extrai o ID do estudante dos parâmetros da solicitação
    const { id } = req.params;
    // Extrai o ID do flashcard da consulta da solicitação
    const { cardId } = req.query;

    try {
        // Encontra o estudante pelo ID fornecido
        const student = await Student_Model.findById(id);

        // Se o estudante não for encontrado, retorna um erro 404
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Encontra o índice do flashcard no array de flashcards do estudante
        const flashcardIndex = student.flashCards.findIndex(
            (flashcard) => flashcard.id == cardId
        );

        // Se o flashcard não for encontrado, retorna um erro 404
        if (flashcardIndex === -1) {
            return res.status(404).json({ error: "Flashcard not found" });
        }

        // Remove o flashcard do array
        student.flashCards.splice(flashcardIndex, 1);

        // Salva as alterações no banco de dados
        await student.save();

        // Retorna uma resposta de sucesso com o estudante atualizado
        return res
            .status(200)
            .json({ message: "Flashcard deleted successfully", student });
    } catch (error) {
        // Registra o erro no console e retorna um erro 500 se algo der errado
        console.error("Erro ao processar o pedido:", error);
        res.status(500).json({ error: "Erro ao processar o pedido" });
    }
};

module.exports = { flashcard_delete1Card };
