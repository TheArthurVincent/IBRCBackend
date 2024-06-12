const { default: mongoose } = require("mongoose");
const { Student_Model } = require("../models/Students");

const reviewsToday = 30;

const reviewList = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const currentDate = new Date();

    const today = new Date().toISOString().slice(0, 10);

    const reviewsDoneTodayCount = student.flashcardsDailyReviews.filter(
      (review) => review.date.toISOString().slice(0, 10) === today
    ).length;

    const remainingFlashcardsToReview = reviewsToday - reviewsDoneTodayCount;

    let dueFlashcards = student.flashCards.filter(
      (card) => new Date(card.reviewDate) <= currentDate
    );

    if (dueFlashcards.length < remainingFlashcardsToReview) {
      const futureFlashcards = student.flashCards
        .filter((card) => new Date(card.reviewDate) > currentDate)
        .sort((a, b) => new Date(a.reviewDate) - new Date(b.reviewDate));

      for (let card of futureFlashcards) {
        if (dueFlashcards.length >= remainingFlashcardsToReview) break;
        dueFlashcards.push(card);
      }
    }

    const limitedDueFlashcards = dueFlashcards.slice(
      0,
      remainingFlashcardsToReview
    );

    const newCardsCount = limitedDueFlashcards.filter(
      (card) => card.isNew
    ).length;
    const reviewedCardsCount = limitedDueFlashcards.filter(
      (card) => !card.isNew
    ).length;

    const cardsCount = {
      newCardsCount,
      reviewedCardsCount,
    };



    const difficulties = {
      veryhard: new Date(),
      hard: new Date(currentDate.setDate(currentDate.getDate() + 1)),
    }

    limitedDueFlashcards.forEach(card => {
      card.hard = new Date(currentDate.setDate(currentDate.getDate() + 1.5));
      card.medium = new Date(currentDate.setDate(currentDate.getDate() + Math.ceil(card.reviewRate * 1.5)));
      card.easy = new Date(currentDate.setDate(currentDate.getDate() + Math.ceil(card.reviewRate * 2)));
    });

    return res.status(200).json({
      message: "Success",
      dueFlashcards: limitedDueFlashcards,
      cardsCount,
    });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};


const flashcard_createNew = async (req, res) => {
  const { id } = req.params;
  const { newCards } = req.body;
  const student = await Student_Model.findById(id);
  try {
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const newFlashcards = newCards.map((card) => ({
      id: new mongoose.Types.ObjectId(),
      front: card.front,
      back: card.back,
      reviewDate: card.reviewDate || new Date(),
      reviewRate: card.reviewRate || 1,
      isNew: card.isNew || true,
    }));

    student.flashCards.push(...newFlashcards);

    await student.save();
    return res.status(200).json({ message: "Success", newFlashcards });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};

const flashcard_updateOne = async (req, res) => {
  const { id } = req.params;
  const { flashcardId, newFront, newBack } = req.body;

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const flashcard = student.flashCards.id(flashcardId);

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    if (newFront) {
      flashcard.front = { ...flashcard.front, ...newFront };
    }

    if (newBack) {
      flashcard.back = { ...flashcard.back, ...newBack };
    }

    await student.save();

    return res
      .status(200)
      .json({ message: "Flashcard updated successfully", student });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};

const flashcard_reviewCard = async (req, res) => {
  const { id } = req.params;
  const { flashcardId, difficulty } = req.body;

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const flashcard = student.flashCards.find(
      (card) => card.id.toString() === flashcardId
    );

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    const currentDate = new Date();

    switch (difficulty) {
      case "veryhard":
        flashcard.reviewDate = currentDate;
        flashcard.reviewRate = 1;
        break;
      case "hard":
        flashcard.reviewRate = 1.5;
        flashcard.reviewDate = new Date(
          currentDate.setDate(currentDate.getDate() + 1) // Today + 1 = Tomorrow
        );
        break;
      case "medium":
        flashcard.reviewRate *= 1.5; //2.75
        flashcard.reviewDate = new Date(
          currentDate.setDate(
            currentDate.getDate() + Math.ceil(flashcard.reviewRate) // 3 days
          )
        );
        break;
      case "easy":
        flashcard.reviewRate *= 2; // 5.5  // 11
        flashcard.reviewDate = new Date(
          currentDate.setDate(
            currentDate.getDate() + Math.ceil(flashcard.reviewRate) // 6 days // 11 days
          )
        );
        break;
      default:
        return res.status(400).json({ error: "Invalid difficulty level" });
    }

    const today = new Date().toISOString().slice(0, 10);

    const reviewsDoneTodayCount = student.flashcardsDailyReviews.filter(
      (review) => review.date.toISOString().slice(0, 10) === today
    ).length;

    const uniqueTImeLineItem = student.scoreTimeline.filter(
      (item) => item.unique === true
    ).length;

    console.log(uniqueTImeLineItem);
    const scoreFor30Reviews = 45;

    if (
      difficulty !== "veryhard" &&
      reviewsDoneTodayCount == reviewsToday - 1 &&
      uniqueTImeLineItem == 0
    ) {
      student.totalScore += scoreFor30Reviews;
      student.monthlyScore += scoreFor30Reviews;

      const timeline = {
        date: new Date(),
        unique: true,
        score: scoreFor30Reviews,
        description: "Flashcards revisados",
        type: "Anki",
      };

      student.scoreTimeline.push(timeline);
    }

    student.flashCards = student.flashCards.filter(
      (card) => card.id.toString() !== flashcardId
    );

    const newFlashCard = {
      id: new mongoose.Types.ObjectId(),
      front: flashcard.front,
      back: flashcard.back,
      reviewDate: flashcard.reviewDate,
      reviewRate: flashcard.reviewRate,
      isNew: false,
    };

    student.flashCards.push(newFlashCard);

    if (difficulty !== "veryhard") {
      student.flashcardsDailyReviews.push({
        date: new Date(),
        card: flashcard.front.text,
      });
    } else {
      null;
    }

    await student.save();

    return res.status(200).json({ message: "Card reviewed", student });
  } catch (error) {
    console.error("Not reviewed:", error);
    return res.status(500).json({ error: "Not reviewed" });
  }
};

const flashcard_deleteCard = async (req, res) => {
  const { id } = req.params;
  const { flashcardId } = req.body;

  try {
    const student = await Student_Model.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const flashcard = student.flashCards.id(flashcardId);

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    await student.save();

    return res
      .status(200)
      .json({ message: "Flashcard deleted successfully", student });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};

module.exports = {
  flashcard_reviewCard,
  flashcard_updateOne,
  flashcard_createNew,
  flashcard_deleteCard,
  reviewList,
};
