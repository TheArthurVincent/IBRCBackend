const { homework_getAll, } = require("../../controller/homeworkController/getAllHomework/getAllHomework");
const { homework_done, } = require("../../controller/homeworkController/homeworkDone/homeworkDone");
const { loggedIn, loggedInADM, } = require("../../controller/studentsController/loggedInAuth/loggedInAuth");

const homeworkRoutes = [
  {
    method: "get",
    path: "/homework/:id",
    middlewares: [loggedIn],
    handler: homework_getAll,
  },
  {
    method: "put",
    path: "/homework/:id",
    middlewares: [loggedIn, loggedInADM],
    handler: homework_done,
  },
];

module.exports = { homeworkRoutes };
