const express = require("express");
const app = express();
const database = require("./db/conn");
const PORT = 3502;
const cors = require("cors");

const { student_deleteOne, student_editGeneralData, student_editPassword, student_editPermissions, student_editPersonalPassword } = require("./server/controller/studentsController");
const { blogPosts_getAll, blogPosts_editOne, blogPosts_getOne, blogPosts_postOne, blogPosts_deleteOne } = require("./server/controller/blogPostsController");
const { tutoring_postOne, tutoring_getAllFromParticularStudent, tutoring_getAllFromParticularStudentInAParticularMonth, tutoring_getListOfAParticularMonthOfAStudent, tutoring_getNext, tutoring_getAll, tutoring_deleteOne } = require("./server/controller/tutoringController");
const { nextTutoring_editNext, nextTutoring_seeAllTutorings, nextLiveClass_postNext, nextLiveClass_getNext } = require("./server/controller/nextEventsController");
const { groupClasses_getOne, groupClasses_postOneClass, groupClasses_editOneClass, groupClasses_getClassesFromOneModule, groupClasses_deleteOneClass, groupClasses_getAllObjects } = require("./server/controller/groupClassesController");
const { material_postNew, material_deleteOne, material_editOne, material_getAll, material_getOne } = require("./server/controller/materialController");
const { event_New, events_editOne, events_seeAll, events_seeOne, events_editOneStatus, events_deleteOne, events_seeAllTutoringsFromOneStudent, events_editOneTutoring, event_NewTutoring, event_DeleteTutoring, events_seeNext, event_reminderEvent, event_reminderEventAutomatic } = require("./server/controller/eventsController");
const { flashcard_reviewCard, flashcard_createNew, flashcard_updateOne, flashcard_deleteCard, reviewList, flashcard_getOne, allCardsList } = require("./server/controller/flashCardsController");
const { homework_getAll, homework_done } = require("./server/controller/homeworkController");
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

database();
app.use(express.json());
const mainroute = "/api/v1";

app.use(cors({ origin: "*" }));

// ** STUDENTS **
// Cadastro de um novo aluno
app.post(`${mainroute}/signupstudent`, student_signUp);
// Cadastro de um novo aluno

// Login de um  aluno
app.post(`${mainroute}/studentlogin/`, student_login);
// Login de um  aluno

// Ver todos os alunos
app.get(`${mainroute}/students`, loggedIn, loggedInADM, students_getAll);
// Ver todos os alunos

// Score mensal dos alunos
app.get(`${mainroute}/scoresranking`, loggedIn, students_getAllScores);
// Score mensal dos alunos

// Score total dos alunos
app.get(`${mainroute}/scorestotalranking`, loggedIn, students_getTotalAllScores);
// Score total dos alunos

// Itens de histórico de vencedores
app.get(`${mainroute}/allitemhistory`, loggedIn, loggedInADM, student_getAllRankingItems);
// Itens de histórico de vencedores

// Novo item de histórico dos rankings
app.post(`${mainroute}/newitemhistory`, loggedIn, loggedInADM, student_newRankingItem);
// Novo item de histórico dos rankings

// Resetar mês
app.put(`${mainroute}/resetmonthscoresecurethepoints`, loggedIn, loggedInADM, SUPREME, student_resetMonth);
// Resetar mês

// Atualizar score
app.put(`${mainroute}/score/:id`, loggedIn, loggedInADM, SUPREME, student_scoreUpdate);
// Atualizar score

// Ver score
app.get(`${mainroute}/score/:id`, loggedIn, student_getScore);
// Ver score

// Ver nome completo do aluno
app.get(`${mainroute}/studentname/:id`, loggedIn, students_getOneFullName);
// Ver nome completo do aluno

// Ver um aluno
app.get(`${mainroute}/student/:id`, loggedIn, students_getOne);
// Ver um aluno

// Postar um aluno como administrador
app.post(`${mainroute}/students`, loggedIn, loggedInADM, student_postOne);
// Postar um aluno como administrador


app.put(`${mainroute}/students/:id`, loggedIn, loggedInADM, student_editGeneralData);


app.put(`${mainroute}/studentpassword/:id`, loggedIn, loggedInADM, student_editPassword);
app.put(`${mainroute}/studentperspassword/:id`, loggedIn, student_editPersonalPassword);
app.put(`${mainroute}/studentpermissions/:id`, loggedIn, loggedInADM, student_editPermissions);
app.delete(`${mainroute}/students/:id`, loggedIn, loggedInADM, student_deleteOne);





















// ** COURSES **
app.get(`${mainroute}/allgroupclasses`, loggedIn, groupClasses_getAllObjects);

// ** TUTORING - Aulas Particulares **
app.get(`${mainroute}/tutoring`, loggedIn, tutoring_getAll);
app.get(`${mainroute}/tutoring/:studentID`, loggedIn, tutoring_getAllFromParticularStudent);
app.get(`${mainroute}/tutoringclassesofthemonth/`, loggedIn, tutoring_getAllFromParticularStudentInAParticularMonth);
app.get(`${mainroute}/tutoringmonthyear/:studentID`, loggedIn, tutoring_getListOfAParticularMonthOfAStudent);

app.delete(`${mainroute}/tutoring/:id`, loggedIn, loggedInADM, tutoring_deleteOne);
app.post(`${mainroute}/tutoring`, loggedIn, loggedInADM, tutoring_postOne);

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

// * Homework *
app.get(`${mainroute}/homework/:id`, loggedIn, homework_getAll);
app.put(`${mainroute}/homework/:id`, loggedIn, loggedInADM, homework_done);
// app.put(`${mainroute}/homeworkallpending`,homework_allpending  );

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

// ** NEXT CLASSES **
app.get(`${mainroute}/nexttutoring`, loggedIn, nextTutoring_seeAllTutorings);
app.post(`${mainroute}/nexttutoring`, loggedIn, loggedInADM, nextTutoring_editNext);
app.get(`${mainroute}/nexttutoring/:id`, loggedIn, tutoring_getNext);

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

// Live Classes
app.post(`${mainroute}/liveclass`, loggedIn, nextLiveClass_postNext);
app.get(`${mainroute}/liveclasses`, loggedIn, nextLiveClass_getNext);
app.get(`${mainroute}/sendnotificationemail`, loggedIn, event_reminderEventAutomatic);

// ** App rodando **
app.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
