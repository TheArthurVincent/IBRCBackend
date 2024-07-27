const { groupClasses_delete1Class } = require("../../controller/groupClassesController/deleteOneGroupClass/deleteOneGroupClass");
const { groupClasses_edit1Class } = require("../../controller/groupClassesController/editOneGroupClass/editOneGroupClass");
const { groupClasses_getAllObjects } = require("../../controller/groupClassesController/getAllGroupClasses/getAllGroupClasses");
const { groupClasses_get1Class } = require("../../controller/groupClassesController/getOneGroupClass/getOneGroupClass");
const { groupClasses_post1Class } = require("../../controller/groupClassesController/postOneGroupClass/postOneGroupClass");
const { loggedIn, loggedInADM } = require("../../controller/studentsController/loggedInAuth/loggedInAuth");

const groupClassesRoutes = [
  {
    method: "get",
    path: "/allgroupclasses",
    middlewares: [loggedIn],
    handler: groupClasses_getAllObjects,
  },
  {
    method: "get",
    path: "/groupclass/:id",
    middlewares: [loggedIn],
    handler: groupClasses_get1Class,
  },
  {
    method: "delete",
    path: "/groupclass/:id",
    middlewares: [loggedIn, loggedInADM],
    handler: groupClasses_delete1Class,

  },
  {
    method: "put",
    path: "/groupclass/:id",
    middlewares: [loggedIn, loggedInADM],
    handler: groupClasses_edit1Class,
  },
  {
    method: "post",
    path: "/groupclass",
    middlewares: [loggedIn, loggedInADM],
    handler: groupClasses_post1Class,
  }
];

module.exports = { groupClassesRoutes };
