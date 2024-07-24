const express = require("express");
const app = express();
const database = require("./db/conn");
const PORT = 3502;
const cors = require("cors");

const { blogPosts_getAll, blogPosts_editOne, blogPosts_getOne, blogPosts_postOne, blogPosts_deleteOne } = require("./server/controller/blogPostsController");
const { groupClasses_getOne, groupClasses_postOneClass, groupClasses_editOneClass, groupClasses_getClassesFromOneModule, groupClasses_deleteOneClass, groupClasses_getAllObjects } = require("./server/controller/groupClassesController");
const { material_postNew, material_deleteOne, material_editOne, material_getAll, material_getOne } = require("./server/controller/materialController");
const { event_New, events_editOne, events_seeAll, events_seeOne, events_editOneStatus, events_deleteOne, events_seeAllTutoringsFromOneStudent, events_editOneTutoring, event_NewTutoring, event_DeleteTutoring, events_seeNext, event_reminderEvent, event_reminderEventAutomatic } = require("./server/controller/eventsController");
const { flashcard_reviewCard, flashcard_createNew, flashcard_updateOne, flashcard_deleteCard, reviewList, flashcard_getOne, allCardsList } = require("./server/controller/flashCardsController");
const { courseClasses_postMultipleClasses, courseClasses_getAll, courseClasses_getOne, courseClasses_postNewCourse, courseClasses_postNewModule } = require("./server/controller/coursesController");

///
const { student_signUp } = require("./server/controller/studentsController/signUp/signUp");
const { student_login } = require("./server/controller/studentsController/login/login");
const { students_getAll } = require("./server/controller/studentsController/getAllStudents/getAllStudents");
const { loggedIn, loggedInADM, SUPREME } = require("./server/controller/studentsController/loggedInAuth/loggedInAuth");
const { students_getOne } = require("./server/controller/studentsController/getOneStudent/getOneStudent");
const { students_getAllScores } = require("./server/controller/studentsController/Ranking/getAllScores/getAllScores");
const { students_getTotalAllScores } = require("./server/controller/studentsController/Ranking/getAllTotalScores/getAllTotalScores");
const { student_getAllRankingItems } = require("./server/controller/studentsController/Ranking/getAllRankingItems/getAllRankingItems");
const { student_newRankingItem } = require("./server/controller/studentsController/Ranking/newRankingItem/newRankingItem");
const { student_resetMonth } = require("./server/controller/studentsController/Ranking/resetMonth/resetMonth");
const { student_scoreUpdate } = require("./server/controller/studentsController/Ranking/scoreUpdate/scoreUpdate");
const { student_getScore } = require("./server/controller/studentsController/Ranking/getScore/getScore");
const { students_getOneFullName } = require("./server/controller/studentsController/getOneFullName/getOneFullName");
const { student_postOne } = require("./server/controller/studentsController/postOneStudent/postOneStudent");
const { student_editGeneralData } = require("./server/controller/studentsController/editGeneralData/editGeneralData");
const { student_editPasswordAdm } = require("./server/controller/studentsController/editPassword/editPasswordAdm/editPasswordAdm");
const { student_editPersonalPassword } = require("./server/controller/studentsController/editPassword/editPersonalPassword/editPersonalPassword");
const { student_deleteOne } = require("./server/controller/studentsController/deleteOne/deleteOne");
const { student_editPermissions } = require("./server/controller/studentsController/editPermissions/editPermissions");
const { homework_getAll } = require("./server/controller/homeworkController/getAllHomework/getAllHomework");
const { homework_done } = require("./server/controller/homeworkController/homeworkDone/homeworkDone");
const { tutoring_postOne } = require("./server/controller/tutoringController/postOneTutoring/postOneTutoring");
const { tutoring_deleteOne } = require("./server/controller/tutoringController/deleteOneTutoring/deleteOneTutoring");
const { tutoring_getAll } = require("./server/controller/tutoringController/getAllTutorings/getAllTutorings");
const { tutoring_getAllFromParticularStudent } = require("./server/controller/tutoringController/getAllFromParticularStudent/getAllFromParticularStudent");

database();

app.use(express.json());

const mainroute = "/api/v1";

app.use(cors({ origin: "*" }));



























// Definindo as informações das rotas para cada categoria
const studentsRoutes = [
  { method: 'post', path: '/signupstudent', middlewares: [], handler: student_signUp },
  { method: 'post', path: '/studentlogin', middlewares: [], handler: student_login },
  { method: 'get', path: '/students', middlewares: [loggedIn, loggedInADM], handler: students_getAll },
  { method: 'get', path: '/scoresranking', middlewares: [loggedIn], handler: students_getAllScores },
  { method: 'get', path: '/scorestotalranking', middlewares: [loggedIn], handler: students_getTotalAllScores },
  { method: 'get', path: '/allitemhistory', middlewares: [loggedIn, loggedInADM], handler: student_getAllRankingItems },
  { method: 'post', path: '/newitemhistory', middlewares: [loggedIn, loggedInADM], handler: student_newRankingItem },
  { method: 'put', path: '/resetmonthscoresecurethepoints', middlewares: [loggedIn, loggedInADM, SUPREME], handler: student_resetMonth },
  { method: 'put', path: '/score/:id', middlewares: [loggedIn, loggedInADM, SUPREME], handler: student_scoreUpdate },
  { method: 'get', path: '/score/:id', middlewares: [loggedIn], handler: student_getScore },
  { method: 'get', path: '/studentname/:id', middlewares: [loggedIn], handler: students_getOneFullName },
  { method: 'get', path: '/student/:id', middlewares: [loggedIn], handler: students_getOne },
  { method: 'post', path: '/students', middlewares: [loggedIn, loggedInADM], handler: student_postOne },
  { method: 'put', path: '/students/:id', middlewares: [loggedIn, loggedInADM], handler: student_editGeneralData },
  { method: 'put', path: '/studentpassword/:id', middlewares: [loggedIn, loggedInADM], handler: student_editPasswordAdm },
  { method: 'put', path: '/studentperspassword/:id', middlewares: [loggedIn], handler: student_editPersonalPassword },
  { method: 'delete', path: '/students/:id', middlewares: [loggedIn, loggedInADM], handler: student_deleteOne },
  { method: 'put', path: '/studentpermissions/:id', middlewares: [loggedIn, loggedInADM], handler: student_editPermissions }
];

const homeworkRoutes = [
  { method: 'get', path: '/homework/:id', middlewares: [loggedIn], handler: homework_getAll },
  { method: 'put', path: '/homework/:id', middlewares: [loggedIn, loggedInADM], handler: homework_done }
];

const tutoringRoutes = [
  { method: 'post', path: '/tutoring', middlewares: [loggedIn, loggedInADM], handler: tutoring_postOne },
  { method: 'delete', path: '/tutoring/:id', middlewares: [loggedIn, loggedInADM], handler: tutoring_deleteOne },
  { method: 'get', path: '/tutoring', middlewares: [loggedIn], handler: tutoring_getAll },
  { method: 'get', path: '/tutoring/:studentID', middlewares: [loggedIn], handler: tutoring_getAllFromParticularStudent }
];

const allRoutes = [
  ...studentsRoutes,
  ...homeworkRoutes,
  ...tutoringRoutes
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




























// ** COURSES **
app.get(`${mainroute}/allgroupclasses`, loggedIn, groupClasses_getAllObjects);


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

// * group classes *
app.post(`${mainroute}/groupclass`, loggedIn, loggedInADM, groupClasses_postOneClass);
app.put(`${mainroute}/groupclass/:id`, loggedIn, loggedInADM, groupClasses_editOneClass);
app.get(`${mainroute}/groupclass/`, loggedIn, loggedInADM, groupClasses_getClassesFromOneModule);
app.get(`${mainroute}/groupclass/:id`, loggedIn, loggedInADM, groupClasses_getOne);
app.delete(`${mainroute}/groupclass/:id`, loggedIn, loggedInADM, groupClasses_deleteOneClass);


// **Material**
app.post(`${mainroute}/material`, loggedIn, loggedInADM, material_postNew);
app.delete(`${mainroute}/material/:id`, loggedIn, loggedInADM, material_deleteOne);
app.put(`${mainroute}/material/:id`, loggedIn, loggedInADM, material_editOne);
app.get(`${mainroute}/material/`, loggedIn, material_getAll);
app.get(`${mainroute}/material/:id`, loggedIn, material_getOne);

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
