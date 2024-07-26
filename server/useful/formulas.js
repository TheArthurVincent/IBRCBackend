const { Student_Model } = require("../models/Students");

/**
 * Formata uma data no formato "DD/MM/YYYY".
 *
 * @param {string} dataString - A string de data a ser formatada.
 * @returns {string} - A data formatada como "DD/MM/YYYY".
 */
const formatDate = (dataString) => {
  const data = new Date(dataString);
  const dia = data.getDate();
  const mes = data.getMonth() + 1; // Meses são indexados a partir de 0
  const ano = data.getFullYear();
  const diaFormatado = dia < 10 ? `0${dia}` : dia;
  const mesFormatado = mes < 10 ? `0${mes}` : mes;
  return `${diaFormatado}/${mesFormatado}/${ano}`;
};

/**
 * Recupera um estudante pelo ID.
 *
 * @param {string} id - O ID do estudante a ser recuperado.
 * @returns {Promise} - Uma promessa que resolve com o estudante encontrado ou rejeita com um erro.
 */
const getStudent = async (id) => {
  return await Student_Model.findById(id);
};

/**
 * Configura as rotas de GET no aplicativo Express.
 *
 * @param {Object} app - A instância do aplicativo Express.
 * @param {string} mainroute - A rota base para as rotas GET.
 * @param {Array} routes - Lista de rotas GET a serem configuradas.
 */
function configureGetRoutes(app, mainroute, routes) {
  routes.forEach((route) => {
    if (route.method === "get") {
      app.get(`${mainroute}${route.path}`, ...route.middlewares, route.handler);
    }
  });
}

/**
 * Configura as rotas de POST no aplicativo Express.
 *
 * @param {Object} app - A instância do aplicativo Express.
 * @param {string} mainroute - A rota base para as rotas POST.
 * @param {Array} routes - Lista de rotas POST a serem configuradas.
 */
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

/**
 * Configura as rotas de PUT no aplicativo Express.
 *
 * @param {Object} app - A instância do aplicativo Express.
 * @param {string} mainroute - A rota base para as rotas PUT.
 * @param {Array} routes - Lista de rotas PUT a serem configuradas.
 */
function configurePutRoutes(app, mainroute, routes) {
  routes.forEach((route) => {
    if (route.method === "put") {
      app.put(`${mainroute}${route.path}`, ...route.middlewares, route.handler);
    }
  });
}

/**
 * Configura as rotas de DELETE no aplicativo Express.
 *
 * @param {Object} app - A instância do aplicativo Express.
 * @param {string} mainroute - A rota base para as rotas DELETE.
 * @param {Array} routes - Lista de rotas DELETE a serem configuradas.
 */
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

// Exporta as funções para uso em outros módulos
module.exports = {
  formatDate,
  getStudent,
  configureDeleteRoutes,
  configureGetRoutes,
  configurePostRoutes,
  configurePutRoutes,
};
