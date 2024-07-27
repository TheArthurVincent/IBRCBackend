const { Student_Model } = require("../../../models/Students");
const mongoose = require('mongoose');

/**
 * Cria novos flashcards para um estudante e os adiciona ao seu perfil.
 * 
 * @param {Object} req - O objeto de solicitação da HTTP, contendo parâmetros e corpo da solicitação.
 * @param {Object} res - O objeto de resposta da HTTP, utilizado para retornar o status e mensagem.
 * @returns {Object} - Retorna uma resposta JSON com o status da operação e os novos flashcards criados.
 */
const flashcard_createNewCards = async (req, res) => {
    // Extrai o ID do estudante dos parâmetros da solicitação
    const { id } = req.params;
    // Extrai os novos flashcards do corpo da solicitação
    const { newCards } = req.body;

    try {
        // Encontra o estudante pelo ID fornecido
        const student = await Student_Model.findById(id);

        // Se o estudante não for encontrado, retorna um erro 404
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Cria um conjunto com os textos do lado frontal dos flashcards existentes
        const existingFrontTexts = new Set(
            student.flashCards.map((card) => card.front.text)
        );

        // Filtra e mapeia os novos flashcards que não existem ainda no conjunto de flashcards do estudante
        const newFlashcards = newCards
            .filter(
                (card) => card !== null && !existingFrontTexts.has(card.front.text)
            )
            .map((card, index) => {
                // Define a data de revisão com base na data fornecida ou usa a data atual
                const reviewDate = card.reviewDate
                    ? new Date(card.reviewDate)
                    : new Date();
                // Ajusta a data de revisão
                reviewDate.setMinutes(reviewDate.getMinutes() + index);
                reviewDate.setDate(reviewDate.getDate() - 2);

                return {
                    id: new mongoose.Types.ObjectId(), // Gera um novo ID único para o flashcard
                    front: card.front,
                    back: card.back,
                    backComments: card.backComments || "", // Define os comentários do verso ou usa uma string vazia
                    reviewDate: reviewDate,
                    reviewRate: card.reviewRate || 1, // Define a taxa de revisão ou usa o valor padrão 1
                    veryhardReviews: card.veryhardReviews || 0, // Define o número de revisões muito difíceis ou usa 0
                    hardReviews: card.hardReviews || 0, // Define o número de revisões difíceis ou usa 0
                    mediumReviews: card.mediumReviews || 0, // Define o número de revisões médias ou usa 0
                    easyReviews: card.easyReviews || 0, // Define o número de revisões fáceis ou usa 0
                    numberOfReviews: card.numberOfReviews || 0, // Define o número total de revisões ou usa 0
                    isNew: card.isNew || true, // Define se o flashcard é novo ou usa o valor padrão true
                };
            });

        // Filtra e mapeia os flashcards opostos, trocando frente e verso
        const newFlashcardsOpposite = newCards
            .filter(
                (card) => card !== null && !existingFrontTexts.has(card.front.text)
            )
            .map((card, index) => {
                // Define a data de revisão com base na data fornecida ou usa a data atual
                const reviewDate = card.reviewDate
                    ? new Date(card.reviewDate)
                    : new Date();
                // Ajusta a data de revisão
                reviewDate.setMinutes(reviewDate.getMinutes() + index);
                reviewDate.setDate(reviewDate.getDate() - 5);
                const reviewFuture = reviewDate.setDate(reviewDate.getDate() + 8);

                return {
                    id: new mongoose.Types.ObjectId(), // Gera um novo ID único para o flashcard
                    front: card.back, // Define o verso como frente
                    back: card.front, // Define a frente como verso
                    backComments: card.backComments || "", // Define os comentários do verso ou usa uma string vazia
                    reviewDate: reviewFuture,
                    reviewRate: 3, // Define a taxa de revisão para o flashcard oposto
                    veryhardReviews: card.veryhardReviews || 0, // Define o número de revisões muito difíceis ou usa 0
                    hardReviews: card.hardReviews || 0, // Define o número de revisões difíceis ou usa 0
                    mediumReviews: card.mediumReviews || 0, // Define o número de revisões médias ou usa 0
                    easyReviews: card.easyReviews || 0, // Define o número de revisões fáceis ou usa 0
                    numberOfReviews: card.numberOfReviews || 0, // Define o número total de revisões ou usa 0
                    isNew: card.isNew || true, // Define se o flashcard é novo ou usa o valor padrão true
                };
            });

        // Adiciona os novos flashcards e seus opostos ao array de flashcards do estudante
        student.flashCards.push(...newFlashcards, ...newFlashcardsOpposite);

        // Salva as alterações no banco de dados
        await student.save();

        // Retorna uma resposta de sucesso com os novos flashcards criados
        return res.status(200).json({ message: "Success", newFlashcards });
    } catch (error) {
        // Registra o erro no console e retorna um erro 500 se algo der errado
        console.error("Erro ao processar o pedido:", error);
        res.status(500).json({ error: "Erro ao processar o pedido" });
    }
};

module.exports = { flashcard_createNewCards };
