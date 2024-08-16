const { liturgia_getAllLiturgias } = require("../../controller/liturgiaController/getAllLiturgias/getAllLiturgias");
const {
  liturgia_getOne,
} = require("../../controller/liturgiaController/getOneLiturgia/getOneLiturgia");
const {
  liturgia_New,
} = require("../../controller/liturgiaController/newLiturgia/newLiturgia");
const {
  loggedIn,
  loggedInADM,
} = require("../../controller/studentsController/loggedInAuth/loggedInAuth");

const liturgiaRoutes = [
  {
    method: "post",
    path: "/liturgia",
    middlewares: [],
    handler: liturgia_New,
  },
  {
    method: "get",
    path: "/liturgia/:id",
    middlewares: [],
    handler: liturgia_getOne,
  },
  {
    method: "get",
    path: "/liturgias",
    middlewares: [],
    handler: liturgia_getAllLiturgias,
  }
];

module.exports = { liturgiaRoutes };
