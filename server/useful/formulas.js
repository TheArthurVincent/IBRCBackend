const { Student_Model } = require("../models/Students");

const formatDate = (dataString) => {
  const data = new Date(dataString);
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  const diaFormatado = dia < 10 ? `0${dia}` : dia;
  const mesFormatado = mes < 10 ? `0${mes}` : mes;
  return `${diaFormatado}/${mesFormatado}/${ano}`;
}

const getStudent = async (id) => { await Student_Model.findById(id) };



// Funções para configurar rotas com Express
function configureGetRoutes(app, mainroute, routes) {
  routes.forEach((route) => {
    if (route.method === "get") {
      app.get(`${mainroute}${route.path}`, ...route.middlewares, route.handler);
    }
  });
}

function configurePostRoutes(app, mainroute, routes) {
  routes.forEach((route) => {
    if (route.method === "post") {
      app.post(
        `${mainroute}${route.path}`,
        ...route.middlewares,
        route.handler
      );
    }
  });
}

function configurePutRoutes(app, mainroute, routes) {
  routes.forEach((route) => {
    if (route.method === "put") {
      app.put(`${mainroute}${route.path}`, ...route.middlewares, route.handler);
    }
  });
}

function configureDeleteRoutes(app, mainroute, routes) {
  routes.forEach((route) => {
    if (route.method === "delete") {
      app.delete(
        `${mainroute}${route.path}`,
        ...route.middlewares,
        route.handler
      );
    }
  });
}


module.exports = { formatDate, getStudent, configureDeleteRoutes, configureGetRoutes, configurePostRoutes, configurePutRoutes };
