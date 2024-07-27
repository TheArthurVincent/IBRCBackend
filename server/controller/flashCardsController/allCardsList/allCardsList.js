const { Student_Model } = require("../../../models/Students");

/**
 * Obtém a lista de todos os flashcards de um estudante e os retorna ordenados por data de revisão.
 * 
 * @param {Object} req - O objeto de solicitação HTTP, contendo parâmetros da solicitação.
 * @param {Object} res - O objeto de resposta HTTP, utilizado para retornar o status e mensagem.
 * @returns {Object} - Retorna uma resposta JSON com o status da operação e a lista de todos os flashcards ordenados.
 */
const flashcard_allCardsList = async (req, res) => {
    // Extrai o ID do estudante dos parâmetros da solicitação
    const { id } = req.params;

    try {
        // Encontra o estudante pelo ID fornecido
        const student = await Student_Model.findById(id);

        // Se o estudante não for encontrado, retorna um erro 404
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Obtém todos os flashcards do estudante
        let allFlashCards = student.flashCards;

        // Ordena os flashcards pela data de revisão em ordem crescente
        allFlashCards.sort(
            (a, b) => new Date(a.reviewDate) - new Date(b.reviewDate)
        );

        // Retorna uma resposta de sucesso com a lista de todos os flashcards ordenados
        return res.status(200).json({ message: "Success", allFlashCards });
    } catch (error) {
        // Registra o erro no console e retorna um erro 500 se algo der errado
        console.error("Erro ao processar o pedido:", error);
        res.status(500).json({ error: "Erro ao processar o pedido" });
    }
};

module.exports = { flashcard_allCardsList };
