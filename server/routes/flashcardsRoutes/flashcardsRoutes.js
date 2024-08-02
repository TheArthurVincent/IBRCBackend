const { flashcard_allCardsList } = require("../../controller/flashCardsController/allCardsList/allCardsList");
const { flashcard_createNewCards } = require("../../controller/flashCardsController/createOneCard/createOneCard");
const { flashcard_delete1Card } = require("../../controller/flashCardsController/deleteOneCard/deleteOneCard");
const { flashcard_update1Card } = require("../../controller/flashCardsController/editOneCard/editOneCard");
const { flashcard_get1Card } = require("../../controller/flashCardsController/getOneCard/getOneCard");
const { flashcard_reviewList } = require("../../controller/flashCardsController/reviewList/reviewList");
const { flashcard_review1Card } = require("../../controller/flashCardsController/reviewOneCard/reviewOneCard");
const { loggedIn } = require("../../controller/studentsController/loggedInAuth/loggedInAuth");

const flashcardsRoutes = [
  {
    method: "delete",
    path: "/flashcard/:id",
    middlewares: [loggedIn],
    handler: flashcard_delete1Card,
  },
  {
    method: "put",
    path: "/flashcard/:id",
    middlewares: [loggedIn],
    handler: flashcard_update1Card,
  },
  {
    method: "post",
    path: "/flashcard/:id",
    middlewares: [loggedIn],
    handler: flashcard_createNewCards,
  },
  {
    method: "get",
    path: "/flashcardfindone/:id",
    middlewares: [loggedIn],
    handler: flashcard_get1Card,
  },
  {
    method: "get",
    path: "/cards/:id",
    middlewares: [loggedIn],
    handler: flashcard_allCardsList,
  },
  {
    method: "get",
    path: "/flashcards/:id",
    middlewares: [loggedIn],
    handler: flashcard_reviewList,
  },
  {
    method: "put",
    path: "/reviewflashcard/:id",
    middlewares: [loggedIn],
    handler: flashcard_review1Card,
  }
];

module.exports = { flashcardsRoutes };
