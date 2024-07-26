const { Student_Model } = require("../../../models/Students");

const REVIEWS_TODAY = 50;

/**
 * Formata a data no formato "YYYY-MM-DD".
 * 
 * @param {Date} date - A data a ser formatada.
 * @returns {string} - Data formatada.
 */
const formatDate = (date) => date.toISOString().slice(0, 10);

/**
 * Recupera a lista de flashcards a serem revisados.
 * 
 * @param {Object} req - Requisição HTTP.
 * @param {Object} res - Resposta HTTP.
 * @returns {Object} - Resposta com os flashcards a serem revisados.
 */
const flashcard_reviewList = async (req, res) => {
    const { id } = req.params;
    const today = formatDate(new Date());

    try {
        const student = await Student_Model.findById(id);

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        const reviewsDoneTodayCount = student.flashcardsDailyReviews.filter(
            (review) => formatDate(new Date(review.date)) === today
        ).length;

        const remainingFlashcardsToReview = REVIEWS_TODAY - reviewsDoneTodayCount;

        if (remainingFlashcardsToReview <= 0) {
            return res.status(200).json({
                message: "Success",
                dueFlashcards: [],
                cardsCount: [],
            });
        }

        const dueFlashcards = student.flashCards.filter((card) =>
            formatDate(new Date(card.reviewDate)) <= today
        );

        const futureFlashcards = student.flashCards.filter((card) =>
            formatDate(new Date(card.reviewDate)) > today
        );

        if (dueFlashcards.length < remainingFlashcardsToReview) {
            const needed = remainingFlashcardsToReview - dueFlashcards.length;
            dueFlashcards.push(...futureFlashcards.slice(0, needed));
        }

        const deckOrganized = dueFlashcards.sort(
            (a, b) => new Date(a.reviewDate) - new Date(b.reviewDate)
        );

        const limitedDueFlashcards = deckOrganized.slice(0, remainingFlashcardsToReview);

        const newCardsCount = limitedDueFlashcards.filter(card => card.isNew).length;
        const reviewedCardsCount = limitedDueFlashcards.length - newCardsCount;

        limitedDueFlashcards.forEach((card) => {
            const currentDateClone = new Date();
            card.hard = new Date(currentDateClone.setHours(currentDateClone.getHours() + 10));
            card.medium = new Date(currentDateClone.setHours(currentDateClone.getHours() + 24 * card.reviewRate * 1.5));
            card.easy = new Date(currentDateClone.setHours(currentDateClone.getHours() + 24 * card.reviewRate * 2));
        });

        return res.status(200).json({
            message: "Success",
            dueFlashcards: limitedDueFlashcards,
            cardsCount: { newCardsCount, reviewedCardsCount, remainingFlashcardsToReview },
            reviewsToday: REVIEWS_TODAY,
            currentDate: new Date(),
            today,
            remainingFlashcardsToReview,
            checkDateBeforeCount: reviewsDoneTodayCount,
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Error processing request" });
    }
};

module.exports = {
    flashcard_reviewList,
};
