const { Student_Model } = require("../../../models/Students");
const { default: mongoose } = require("mongoose");

/**
 * Atualiza o status de revisão de um flashcard específico para um estudante.
 * 
 * @param {Object} req - O objeto de solicitação HTTP, contendo parâmetros e corpo da solicitação.
 * @param {Object} res - O objeto de resposta HTTP, utilizado para retornar o status e mensagem.
 * @returns {Object} - Retorna uma resposta JSON com o status da operação e o estudante atualizado.
 */
const flashcard_review1Card = async (req, res) => {
    // Extrai o ID do estudante dos parâmetros da solicitação
    const { id } = req.params;
    // Extrai o ID do flashcard e o nível de dificuldade do corpo da solicitação
    const { flashcardId, difficulty } = req.body;
    // Cria uma nova data para registrar o momento atual
    let currentDate = new Date();

    try {
        // Encontra o estudante pelo ID fornecido
        const student = await Student_Model.findById(id);

        // Se o estudante não for encontrado, retorna um erro 404
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Encontra o flashcard específico dentro dos flashcards do estudante
        const flashcard = student.flashCards.find(
            (card) => card.id.toString() === flashcardId
        );

        // Se o flashcard não for encontrado, retorna um erro 404
        if (!flashcard) {
            return res.status(404).json({ error: "Flashcard not found" });
        }

        // Variável para armazenar as horas a serem adicionadas à data de revisão
        let hoursToAdd;
        // Cria uma cópia da data atual para manipulação
        const currentDateClone = new Date(currentDate);

        // Ajusta a data de revisão e a taxa de revisão com base no nível de dificuldade
        switch (difficulty) {
            case "veryhard":
                flashcard.reviewDate = new Date(
                    currentDateClone.setSeconds(currentDateClone.getSeconds() + 30)
                );
                flashcard.reviewRate = 1.1; // Taxa de revisão para "muito difícil"
                break;
            case "hard":
                flashcard.reviewRate = 1.5; // Taxa de revisão para "difícil"
                hoursToAdd = 24;
                flashcard.reviewDate = new Date(
                    currentDateClone.setHours(currentDateClone.getHours() + hoursToAdd)
                );
                break;
            case "medium":
                flashcard.reviewRate *= 1.5; // Taxa de revisão para "média"
                hoursToAdd = flashcard.reviewRate * 24;
                flashcard.reviewDate = new Date(
                    currentDateClone.setHours(currentDateClone.getHours() + hoursToAdd)
                );
                break;
            case "easy":
                flashcard.reviewRate *= 2; // Taxa de revisão para "fácil"
                hoursToAdd = flashcard.reviewRate * 24;
                flashcard.reviewDate = new Date(
                    currentDateClone.setHours(currentDateClone.getHours() + hoursToAdd)
                );
                break;
            default:
                // Retorna um erro 400 se o nível de dificuldade for inválido
                return res.status(400).json({ error: "Invalid difficulty level" });
        }

        // Remove o flashcard antigo da lista e adiciona o novo flashcard com a data de revisão atualizada
        student.flashCards = student.flashCards.filter(
            (card) => card.id.toString() !== flashcardId
        );
        const newFlashCard = {
            id: new mongoose.Types.ObjectId(), // Gera um novo ID único para o flashcard
            front: flashcard.front,
            back: flashcard.back,
            reviewDate: flashcard.reviewDate,
            reviewRate: flashcard.reviewRate,
            numberOfReviews: flashcard.numberOfReviews + 1, // Incrementa o número de revisões
            isNew: false,
        };

        student.flashCards.push(newFlashCard);

        // Atualiza o registro de revisões diárias e a pontuação do estudante, se a dificuldade não for "muito difícil"
        if (difficulty !== "veryhard") {
            student.flashcardsDailyReviews.push({
                date: currentDate,
                card: flashcard.front.text,
            });

            // Pontuação para a revisão do flashcard
            let scoreFor1Card = 5;

            // Adiciona o registro de pontuação ao histórico do estudante
            const timelineCard = {
                date: new Date(),
                score: scoreFor1Card,
                description: `${scoreFor1Card} Pontos por ter revisado o flashcard ${flashcard.front.text}`,
                type: "Anki",
            };

            // Atualiza a pontuação total e mensal do estudante
            student.totalScore += scoreFor1Card;
            student.monthlyScore += scoreFor1Card;
            student.scoreTimeline.push(timelineCard);
        }

        // Salva as alterações no banco de dados
        await student.save();

        // Retorna uma resposta de sucesso com o estudante atualizado
        return res.status(200).json({ message: "Card reviewed", student });
    } catch (error) {
        // Registra o erro no console e retorna um erro 500 se algo der errado
        console.error("Not reviewed:", error);
        return res.status(500).json({ error: "Not reviewed" });
    }
};

module.exports = { flashcard_review1Card };
