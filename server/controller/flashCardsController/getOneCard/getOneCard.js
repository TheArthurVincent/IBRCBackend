const { Student_Model } = require("../../../models/Students");

/**
 * Obtém um flashcard específico de um estudante.
 * 
 * @param {Object} req - O objeto de solicitação da HTTP, contendo parâmetros e consulta.
 * @param {Object} res - O objeto de resposta da HTTP, utilizado para retornar o status e mensagem.
 * @returns {Object} - Retorna uma resposta JSON com o status da operação e o flashcard solicitado.
 */
const flashcard_get1Card = async (req, res) => {
    // Extrai o ID do estudante dos parâmetros da solicitação
    const { id } = req.params;
    // Extrai o ID do flashcard dos parâmetros de consulta
    const { cardId } = req.query;

    try {
        // Encontra o estudante pelo ID fornecido
        const student = await Student_Model.findById(id);

        // Se o estudante não for encontrado, retorna um erro 404
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Encontra o flashcard específico dentro dos flashcards do estudante
        let foundFlashcard = student.flashCards.find(
            (flashcard) => flashcard.id == cardId
        );

        // Se o flashcard não for encontrado, retorna um erro 404
        if (!foundFlashcard) {
            return res.status(404).json({ error: "Flashcard not found" });
        }

        // Retorna uma resposta de sucesso com o flashcard encontrado
        return res.status(200).json({
            message: "Flashcard found successfully",
            flashcard: foundFlashcard,
        });
    } catch (error) {
        // Registra o erro no console e retorna um erro 500 se algo der errado
        console.error("Erro ao processar o pedido:", error);
        return res.status(500).json({ error: "Erro ao processar o pedido" });
    }
};

module.exports = { flashcard_get1Card };
