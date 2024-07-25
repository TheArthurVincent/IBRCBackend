const { loggedIn, loggedInADM } = require("../../controller/studentsController/loggedInAuth/loggedInAuth");
const { tutoring_deleteOne } = require("../../controller/tutoringController/deleteOneTutoring/deleteOneTutoring");
const { tutoring_getAllFromParticularStudent } = require("../../controller/tutoringController/getAllFromParticularStudent/getAllFromParticularStudent");
const { tutoring_getAll } = require("../../controller/tutoringController/getAllTutorings/getAllTutorings");
const { tutoring_postOne } = require("../../controller/tutoringController/postOneTutoring/postOneTutoring");

const tutoringRoutes = [
  {
    method: "post",
    path: "/tutoring",
    middlewares: [loggedIn, loggedInADM],
    handler: tutoring_postOne,
  },
  {
    method: "delete",
    path: "/tutoring/:id",
    middlewares: [loggedIn, loggedInADM],
    handler: tutoring_deleteOne,
  },
  {
    method: "get",
    path: "/tutoring",
    middlewares: [loggedIn],
    handler: tutoring_getAll,
  },
  {
    method: "get",
    path: "/tutoring/:studentID",
    middlewares: [loggedIn],
    handler: tutoring_getAllFromParticularStudent,
  },
];

module.exports = { tutoringRoutes };
