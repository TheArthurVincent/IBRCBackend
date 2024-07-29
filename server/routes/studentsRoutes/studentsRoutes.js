const { student_deleteOne } = require("../../controller/studentsController/deleteOne/deleteOne");
const { student_editGeneralData } = require("../../controller/studentsController/editGeneralData/editGeneralData");
const { student_editPasswordAdm } = require("../../controller/studentsController/editPassword/editPasswordAdm/editPasswordAdm");
const { student_editPersonalPassword } = require("../../controller/studentsController/editPassword/editPersonalPassword/editPersonalPassword");
const { student_editPermissions } = require("../../controller/studentsController/editPermissions/editPermissions");
const { students_getAll } = require("../../controller/studentsController/getAllStudents/getAllStudents");
const { students_getOneFullName } = require("../../controller/studentsController/getOneFullName/getOneFullName");
const { students_getOne } = require("../../controller/studentsController/getOneStudent/getOneStudent");
const { loggedIn, loggedInADM, SUPREME } = require("../../controller/studentsController/loggedInAuth/loggedInAuth");
const { student_login } = require("../../controller/studentsController/login/login");
const { student_postOne } = require("../../controller/studentsController/postOneStudent/postOneStudent");
const { student_getAllRankingItems } = require("../../controller/studentsController/Ranking/getAllRankingItems/getAllRankingItems");
const { students_getAllScores } = require("../../controller/studentsController/Ranking/getAllScores/getAllScores");
const { students_getTotalAllScores } = require("../../controller/studentsController/Ranking/getAllTotalScores/getAllTotalScores");
const { student_getScore } = require("../../controller/studentsController/Ranking/getScore/getScore");
const { student_newRankingItem } = require("../../controller/studentsController/Ranking/newRankingItem/newRankingItem");
const { student_resetMonth } = require("../../controller/studentsController/Ranking/resetMonth/resetMonth");
const { student_scoreUpdate } = require("../../controller/studentsController/Ranking/scoreUpdate/scoreUpdate");
const { student_signUp } = require("../../controller/studentsController/signUp/signUp");

const studentsRoutes = [
  {
    method: "post",
    path: "/signupstudent",
    middlewares: [],
    handler: student_signUp,
  },
  {
    method: "post",
    path: "/studentlogin",
    middlewares: [],
    handler: student_login,
  },
  {
    method: "get",
    path: "/students",
    middlewares: [loggedIn, loggedInADM],
    handler: students_getAll,
  },
  {
    method: "get",
    path: "/scoresranking",
    middlewares: [loggedIn],
    handler: students_getAllScores,
  },
  {
    method: "get",
    path: "/scorestotalranking",
    middlewares: [loggedIn],
    handler: students_getTotalAllScores,
  },
  {
    method: "get",
    path: "/allitemhistory",
    middlewares: [loggedIn],
    handler: student_getAllRankingItems,
  },
  {
    method: "post",
    path: "/newitemhistory",
    middlewares: [loggedIn, loggedInADM],
    handler: student_newRankingItem,
  },
  {
    method: "put",
    path: "/resetmonthscoresecurethepoints",
    middlewares: [loggedIn, loggedInADM, SUPREME],
    handler: student_resetMonth,
  },
  {
    method: "put",
    path: "/score/:id",
    middlewares: [loggedIn, loggedInADM, SUPREME],
    handler: student_scoreUpdate,
  },
  {
    method: "get",
    path: "/score/:id",
    middlewares: [loggedIn],
    handler: student_getScore,
  },
  {
    method: "get",
    path: "/studentname/:id",
    middlewares: [loggedIn],
    handler: students_getOneFullName,
  },
  {
    method: "get",
    path: "/student/:id",
    middlewares: [loggedIn],
    handler: students_getOne,
  },
  {
    method: "post",
    path: "/students",
    middlewares: [loggedIn, loggedInADM],
    handler: student_postOne,
  },
  {
    method: "put",
    path: "/students/:id",
    middlewares: [loggedIn, loggedInADM],
    handler: student_editGeneralData,
  },
  {
    method: "put",
    path: "/studentpassword/:id",
    middlewares: [loggedIn, loggedInADM],
    handler: student_editPasswordAdm,
  },
  {
    method: "put",
    path: "/studentperspassword/:id",
    middlewares: [loggedIn],
    handler: student_editPersonalPassword,
  },
  {
    method: "delete",
    path: "/students/:id",
    middlewares: [loggedIn, loggedInADM],
    handler: student_deleteOne,
  },
  {
    method: "put",
    path: "/studentpermissions/:id",
    middlewares: [loggedIn, loggedInADM],
    handler: student_editPermissions,
  },
];

module.exports = { studentsRoutes };
