const { courseClasses_getAll } = require("../../controller/coursesController/getAllClasses/getAllClasses");
const { courseClasses_get1 } = require("../../controller/coursesController/getOneClass/getOneClass");
const { courseClasses_postMultiple } = require("../../controller/coursesController/postMultipleClasses/postMultipleClasses");
const { courseClasses_post1NewCourse } = require("../../controller/coursesController/postNewCourse/postNewCourse");
const { courseClasses_post1NewModule } = require("../../controller/coursesController/postNewModule/postNewModule");
const { loggedIn, loggedInADM } = require("../../controller/studentsController/loggedInAuth/loggedInAuth");

const coursesRoutes = [
  {
    method: "get",
    path: "/courses/:studentId",
    middlewares: [loggedIn],
    handler: courseClasses_getAll,
  },
  {
    method: "get",
    path: "/course/:id",
    middlewares: [loggedIn],
    handler: courseClasses_get1,
  },
  {
    method: "post",
    path: "/courseclasses",
    middlewares: [loggedIn, loggedInADM],
    handler: courseClasses_postMultiple,
  },
  { 
    method: "post",
    path: "/course",
    middlewares: [loggedIn, loggedInADM],
    handler: courseClasses_post1NewCourse,
  },
  {
    method: "post",
    path: "/module",
    middlewares: [loggedIn, loggedInADM],
    handler: courseClasses_post1NewModule,
  },
];

module.exports = { coursesRoutes };
