const express = require("express");
const app = express();
const database = require("./db/conn");
const PORT = 3502;
const cors = require("cors");

const { blogPosts_getAll, blogPosts_editOne, blogPosts_getOne, blogPosts_postOne, blogPosts_deleteOne } = require("./server/controller/blogPostsController");
const { event_New, events_editOne, events_seeAll, events_seeOne, events_editOneStatus, events_deleteOne, events_seeAllTutoringsFromOneStudent, events_editOneTutoring, event_NewTutoring, event_DeleteTutoring, events_seeNext, event_reminderEvent, event_reminderEventAutomatic } = require("./server/controller/eventsController");
const { flashcard_reviewCard, flashcard_createNew, flashcard_updateOne, flashcard_deleteCard, reviewList, flashcard_getOne, allCardsList } = require("./server/controller/flashCardsController");
const { courseClasses_postMultipleClasses, courseClasses_getAll, courseClasses_getOne, courseClasses_postNewCourse, courseClasses_postNewModule } = require("./server/controller/coursesController");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const { loggedIn, loggedInADM } = require("./server/controller/studentsController/loggedInAuth/loggedInAuth");
const { homeworkRoutes } = require("./server/routes/homeworkRoutes/homeworkRoutes");
const { studentsRoutes } = require("./server/routes/studentsRoutes/studentsRoutes");
const { tutoringRoutes } = require("./server/routes/tutoringRoutes/tutoringRoutes");
const { groupClassesRoutes } = require("./server/routes/groupClassesRoutes/groupClassesRoutes");

database();
app.use(express.json());
const mainroute = "/api/v1";
app.use(cors({ origin: "*" }));

const allRoutes = [
  ...studentsRoutes,
  ...homeworkRoutes,
  ...tutoringRoutes,
  ...groupClassesRoutes
];

// Funções para configurar rotas com Express
function configureGetRoutes(app, mainroute, routes) {
  routes.forEach(route => {
    if (route.method === 'get') {
      app.get(`${mainroute}${route.path}`, ...route.middlewares, route.handler);
    }
  });
}

function configurePostRoutes(app, mainroute, routes) {
  routes.forEach(route => {
    if (route.method === 'post') {
      app.post(`${mainroute}${route.path}`, ...route.middlewares, route.handler);
    }
  });
}

function configurePutRoutes(app, mainroute, routes) {
  routes.forEach(route => {
    if (route.method === 'put') {
      app.put(`${mainroute}${route.path}`, ...route.middlewares, route.handler);
    }
  });
}

function configureDeleteRoutes(app, mainroute, routes) {
  routes.forEach(route => {
    if (route.method === 'delete') {
      app.delete(`${mainroute}${route.path}`, ...route.middlewares, route.handler);
    }
  });
}

// Configurando todas as rotas
configurePostRoutes(app, mainroute, allRoutes.filter(route => route.method === 'post'));
configureGetRoutes(app, mainroute, allRoutes.filter(route => route.method === 'get'));
configurePutRoutes(app, mainroute, allRoutes.filter(route => route.method === 'put'));
configureDeleteRoutes(app, mainroute, allRoutes.filter(route => route.method === 'delete'));
















// * events *
app.get(`${mainroute}/eventsgeneral/:id`, loggedIn, events_seeAll);
app.get(`${mainroute}/eventseenextttoring/:id`, loggedIn, events_seeNext);
app.post(`${mainroute}/event`, event_New);
app.post(`${mainroute}/tutoringevent`, event_NewTutoring);
app.delete(`${mainroute}/tutoringevent`, event_DeleteTutoring);
app.put(`${mainroute}/event/:id`, events_editOne);
app.put(`${mainroute}/eventstatus/:id`, events_editOneStatus);
app.delete(`${mainroute}/event/:id`, events_deleteOne);
app.post(`${mainroute}/eventreminder/:id`, event_reminderEvent);
app.get(`${mainroute}/event/:id`, events_seeOne);
app.get(`${mainroute}/tutoringsevents/:studentId`, events_seeAllTutoringsFromOneStudent);
app.put(`${mainroute}/tutoringevent`, loggedIn, loggedInADM, events_editOneTutoring);

// * Courses Management *
app.post(`${mainroute}/courseclasses`, loggedIn, loggedInADM, courseClasses_postMultipleClasses);
app.post(`${mainroute}/course`, loggedIn, loggedInADM, courseClasses_postNewCourse);
app.post(`${mainroute}/module`, loggedIn, loggedInADM, courseClasses_postNewModule);
app.get(`${mainroute}/courses/:studentId`, loggedIn, courseClasses_getAll);
app.get(`${mainroute}/course/:id`, loggedIn, courseClasses_getOne);

// **BLOG POSTS**
app.get(`${mainroute}/blogposts`, loggedIn, blogPosts_getAll);
app.get(`${mainroute}/blogpost/:id`, loggedIn, blogPosts_getOne);
app.post(`${mainroute}/blogposts`, loggedIn, loggedInADM, blogPosts_postOne);
app.put(`${mainroute}/blogposts/:id`, loggedIn, loggedInADM, blogPosts_editOne);
app.delete(`${mainroute}/blogposts/:id`, loggedIn, loggedInADM, blogPosts_deleteOne);

// Flashcards
app.post(`${mainroute}/flashcard/:id`, loggedIn, flashcard_createNew);
app.get(`${mainroute}/flashcardfindone/:id`, loggedIn, flashcard_getOne);
app.get(`${mainroute}/cards/:id`, loggedIn, allCardsList);
app.get(`${mainroute}/flashcards/:id`, loggedIn, reviewList);
app.put(`${mainroute}/reviewflashcard/:id`, loggedIn, flashcard_reviewCard);
app.put(`${mainroute}/flashcard/:id`, loggedIn, flashcard_updateOne);
app.delete(`${mainroute}/flashcard/:id`, loggedIn, flashcard_deleteCard);
app.get(`${mainroute}/sendnotificationemail`, loggedIn, event_reminderEventAutomatic);

// ** App rodando **
app.listen(PORT, () => { console.log(`Servidor está ouvindo na porta ${PORT}`); });
