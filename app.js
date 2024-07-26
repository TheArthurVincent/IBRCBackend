const express = require("express");
const database = require("./db/conn");
const cors = require("cors");
const PORT = 3502;
const app = express();

////////////////////////////////////////////////////////

const { configurePostRoutes, configureGetRoutes, configurePutRoutes, configureDeleteRoutes } = require("./server/useful/formulas");
const { loggedIn, loggedInADM } = require("./server/controller/studentsController/loggedInAuth/loggedInAuth");
const { homeworkRoutes } = require("./server/routes/homeworkRoutes/homeworkRoutes");
const { studentsRoutes } = require("./server/routes/studentsRoutes/studentsRoutes");
const { tutoringRoutes } = require("./server/routes/tutoringRoutes/tutoringRoutes");
const { groupClassesRoutes } = require("./server/routes/groupClassesRoutes/groupClassesRoutes");
const { blogPostsRoutes } = require("./server/routes/blogPostsRoutes/blogPostsRoutes");
const { coursesRoutes } = require("./server/routes/coursesRoutes/coursesRoutes");
const { eventsRoutes } = require("./server/routes/eventsRoutes/eventsRoutes");

database();
app.use(express.json());
const mainroute = "/api/v1";
app.use(cors({ origin: "*" }));

const allRoutes = [
  ...eventsRoutes,
  ...studentsRoutes,
  ...homeworkRoutes,
  ...tutoringRoutes,
  ...groupClassesRoutes,
  ...blogPostsRoutes,
  ...coursesRoutes,
];

// Configurando todas as rotas
configurePostRoutes(app, mainroute, allRoutes.filter((route) => route.method === "post"));
configureGetRoutes(app, mainroute, allRoutes.filter((route) => route.method === "get"));
configurePutRoutes(app, mainroute, allRoutes.filter((route) => route.method === "put"));
configureDeleteRoutes(app, mainroute, allRoutes.filter((route) => route.method === "delete"));

// * events *
const { events_editOneStatus, events_seeAllTutoringsFromOneStudent, events_editOneTutoring, event_NewTutoring, events_seeNext, event_reminderEvent, event_reminderEventAutomatic } = require("./server/controller/eventsController");

app.get(`${mainroute}/eventseenextttoring/:id`, loggedIn, events_seeNext);
app.post(`${mainroute}/tutoringevent`, event_NewTutoring);
app.put(`${mainroute}/eventstatus/:id`, events_editOneStatus);

app.post(`${mainroute}/eventreminder/:id`, event_reminderEvent);
app.get(`${mainroute}/tutoringsevents/:studentId`, events_seeAllTutoringsFromOneStudent);
app.put(`${mainroute}/tutoringevent`, loggedIn, loggedInADM, events_editOneTutoring);

// Flashcards
const { flashcard_reviewCard, flashcard_createNew, flashcard_updateOne, flashcard_deleteCard, flashcard_reviewList, flashcard_getOne, flashcard_allCardsList } = require("./server/controller/flashCardsController");

app.post(`${mainroute}/flashcard/:id`, loggedIn, flashcard_createNew);
app.get(`${mainroute}/flashcardfindone/:id`, loggedIn, flashcard_getOne);
app.get(`${mainroute}/cards/:id`, loggedIn, flashcard_allCardsList);
app.get(`${mainroute}/flashcards/:id`, loggedIn, flashcard_reviewList);
app.put(`${mainroute}/reviewflashcard/:id`, loggedIn, flashcard_reviewCard);
app.put(`${mainroute}/flashcard/:id`, loggedIn, flashcard_updateOne);
app.delete(`${mainroute}/flashcard/:id`, loggedIn, flashcard_deleteCard);
app.get(`${mainroute}/sendnotificationemail`, loggedIn, event_reminderEventAutomatic);

// ** App rodando **
app.listen(PORT, () => { console.log(`Servidor está rodando na porta ${PORT}`); });
