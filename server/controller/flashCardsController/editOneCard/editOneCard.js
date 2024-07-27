const { Student_Model } = require("../../../models/Students");

/**
 * Atualiza um flashcard específico de um estudante.
 * 
 * @param {Object} req - O objeto de solicitação da HTTP, contendo parâmetros, consulta e corpo.
 * @param {Object} res - O objeto de resposta da HTTP, utilizado para retornar o status e mensagem.
 * @returns {Object} - Retorna uma resposta JSON com o status da operação e o estudante atualizado.
 */
const flashcard_update1Card = async (req, res) => {
    // Extrai o ID do estudante dos parâmetros da solicitação
    const { id } = req.params;
    // Extrai o ID do flashcard dos parâmetros de consulta
    const { cardId } = req.query;
    // Extrai os novos dados do flashcard do corpo da solicitação
    const { newLGBack, newLGFront, newFront, newBack, newBackComments } = req.body;

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

        // Obtém o flashcard atual
        const flashcard = student.flashCards[flashcardIndex];

        // Remove o flashcard antigo do array
        student.flashCards.splice(flashcardIndex, 1);

        // Cria um novo flashcard com os dados atualizados
        const newFlashcard = {
            id: flashcard.id, // Mantém o mesmo ID para preservar a identidade do flashcard
            backComments: newBackComments, // Atualiza os comentários no verso do flashcard
            front: {
                text: newFront || flashcard.front.text, // Atualiza o texto do lado frontal, se fornecido
                language: newLGFront || flashcard.front.language, // Atualiza o idioma do lado frontal, se fornecido
            },
            back: {
                text: newBack || flashcard.back.text, // Atualiza o texto do lado traseiro, se fornecido
                language: newLGBack || flashcard.back.language, // Atualiza o idioma do lado traseiro, se fornecido
            },
            reviewDate: flashcard.reviewDate, // Mantém a data de revisão original
            reviewRate: flashcard.reviewRate, // Mantém a taxa de revisão original
            numberOfReviews: flashcard.numberOfReviews, // Mantém o número de revisões original
            isNew: flashcard.isNew, // Mantém o status de novo do flashcard
        };

        // Adiciona o novo flashcard atualizado ao array de flashcards do estudante
        student.flashCards.push(newFlashcard);

        // Salva as alterações no banco de dados
        await student.save();

        // Retorna uma resposta de sucesso com o estudante atualizado
        return res
            .status(200)
            .json({ message: "Flashcard updated successfully", student });
    } catch (error) {
        // Registra o erro no console e retorna um erro 500 se algo der errado
        console.error("Erro ao processar o pedido:", error);
        res.status(500).json({ error: "Erro ao processar o pedido" });
    }
};

module.exports = { flashcard_update1Card };
