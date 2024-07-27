const express = require("express");
const database = require("./db/conn");
const cors = require("cors");
const PORT = 3502; // Porta em que o servidor irá rodar
const app = express(); // Cria uma instância do aplicativo Express

/**
 * Importa funções e rotas necessárias para configurar o servidor.
 */
const { configurePostRoutes, configureGetRoutes, configurePutRoutes, configureDeleteRoutes } = require("./server/useful/formulas");
const { homeworkRoutes } = require("./server/routes/homeworkRoutes/homeworkRoutes");
const { studentsRoutes } = require("./server/routes/studentsRoutes/studentsRoutes");
const { tutoringRoutes } = require("./server/routes/tutoringRoutes/tutoringRoutes");
const { groupClassesRoutes } = require("./server/routes/groupClassesRoutes/groupClassesRoutes");
const { blogPostsRoutes } = require("./server/routes/blogPostsRoutes/blogPostsRoutes");
const { coursesRoutes } = require("./server/routes/coursesRoutes/coursesRoutes");
const { eventsRoutes } = require("./server/routes/eventsRoutes/eventsRoutes");
const { flashcardsRoutes } = require("./server/routes/flashcardsRoutes/flashcardsRoutes");

// Conecta ao banco de dados
database();

// Middleware para interpretar JSON
app.use(express.json());

// Define a rota base principal
const mainroute = "/api/v1";

// Configura o CORS para permitir solicitações de qualquer origem
app.use(cors({ origin: "*" }));

/*** Cria uma lista combinada de todas as rotas.
 * @type {Array}
 */
const allRoutes = [
  ...eventsRoutes,
  ...studentsRoutes,
  ...homeworkRoutes,
  ...tutoringRoutes,
  ...groupClassesRoutes,
  ...blogPostsRoutes,
  ...coursesRoutes,
  ...flashcardsRoutes,
];

/**
 * Configura as rotas no aplicativo Express para cada método HTTP.
 */
configurePostRoutes(
  app,
  mainroute,
  allRoutes.filter((route) => route.method === "post")
);
configureGetRoutes(
  app,
  mainroute,
  allRoutes.filter((route) => route.method === "get")
);
configurePutRoutes(
  app,
  mainroute,
  allRoutes.filter((route) => route.method === "put")
);
configureDeleteRoutes(
  app,
  mainroute,
  allRoutes.filter((route) => route.method === "delete")
);

// Inicia o servidor e escuta na porta especificada
app.listen(PORT, () => { console.log(`Servidor está rodando na porta ${PORT}`) });


// Antes da atualização --> app.post(`${mainroute}/eventreminder/:id`, event_reminderEvent);
