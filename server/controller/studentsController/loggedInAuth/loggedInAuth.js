const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { Student_Model } = require("../../../models/Students");
require('dotenv').config();

// Mensagens de erro padronizadas
const ERRORS = {
  NO_USER_LOGGED: "NENHUM USUÁRIO LOGADO",
  USER_NOT_FOUND: "Este usuário já não existe mais",
  PASSWORD_CHANGED: "Você recentemente mudou sua senha. Faça login novamente",
  NOT_ADMIN: "Você não é administrador!!",
  INVALID_LOGIN:
    "Você não está logado de maneira válida, portanto não pode executar esta rota",
  SUPREME: "Não toque nisso",
};

/**
 * Verifica a validade do token JWT e retorna os dados decodificados se válido.
 * Lança um erro se o token for inválido.
 *
 * @param {string} token - Token JWT a ser verificado
 * @returns {Promise<Object>} Dados decodificados do token JWT
 * @throws {Error} Se o token JWT for inválido
 */

const verifyToken = async (token) => {
  try {
    return await promisify(jwt.verify)(token, process.env.SECRET);
  } catch (error) {
    throw new Error(ERRORS.INVALID_LOGIN);
  }
};

/**
 * Busca um usuário pelo ID no banco de dados.
 * Retorna o objeto de usuário se encontrado, senão lança um erro.
 *
 * @param {string} userId - ID do usuário a ser buscado
 * @returns {Promise<Object>} Objeto de usuário encontrado
 * @throws {Error} Se o usuário não for encontrado
 */
const getUser = async (userId) => {
  try {
    return await Student_Model.findById(userId);
  } catch (error) {
    throw new Error(ERRORS.USER_NOT_FOUND);
  }
};

/**
 * Middleware para verificar se há um usuário logado usando token JWT.
 * Verifica se há um token de autorização no cabeçalho da requisição.
 * Decodifica o token, busca o usuário correspondente no banco de dados e verifica algumas condições adicionais.
 * Armazena o usuário autenticado no objeto req e chama o próximo middleware.
 * Retorna erros adequados se não houver token, usuário não for encontrado ou condições adicionais não forem atendidas.
 *
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função do Express para chamar o próximo middleware
 */
const loggedIn = async (req, res, next) => {
  let { authorization } = req.headers;

  // Verifica se há um token de autorização no cabeçalho da requisição
  if (!authorization) {
    return res.status(401).json({ error: ERRORS.NO_USER_LOGGED });
  }

  try {
    // Verifica a validade do token JWT e obtém os dados decodificados
    let decoded = await verifyToken(authorization);

    // Busca o usuário pelo ID decodificado
    let user = await getUser(decoded.id);

    // Verifica se o usuário foi encontrado
    if (!user) {
      return res.status(404).json({ error: ERRORS.USER_NOT_FOUND });
    }

    // Verifica se o usuário mudou a senha antes de fazer login novamente
    if (user.changedPasswordBeforeLogInAgain) {
      return res.status(403).json({ error: ERRORS.PASSWORD_CHANGED });
    }

    // Armazena o usuário autenticado no objeto req para uso posterior nas rotas
    req.user = user;
    next(); // Chama o próximo middleware na cadeia
  } catch (error) {
    // Captura e retorna erros durante a verificação do token ou busca do usuário
    res.status(401).json({ error: error.message });
  }
};

/**
 * Middleware function to check if an administrator user is logged in.
 *
 * Checks if the authenticated user exists and has 'superadmin' permissions.
 *
 * @param {object} req - Express request object containing the authenticated user
 * @param {object} res - Express response object for sending HTTP responses
 * @param {function} next - Express function to pass control to the next middleware
 * @returns {void}
 */
const loggedInADM = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: ERRORS.NO_USER_LOGGED });
  }

  if (req.user.permissions !== "superadmin") {
    return res.status(403).json({ error: ERRORS.NOT_ADMIN });
  }

  next();
};

/**
 * Middleware function to check if the user is authenticated as a supreme user.
 * If the user is not logged in, it returns a 401 Unauthorized error.
 * If the user is logged in but not a supreme user, it returns a 403 Forbidden error.
 * If the user is authenticated as a supreme user, it calls the next middleware.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function to call the next middleware
 */
const SUPREME = (req, res, next) => {
  // Check if there is a user object in the request (logged in user)
  if (!req.user) {
    // If no user object, return 401 Unauthorized error
    return res.status(401).json({ error: ERRORS.NO_USER_LOGGED });
  }

  // Check if the logged in user has 'supreme' role
  if (!req.user.supreme) {
    // If user does not have 'supreme' role, return 403 Forbidden error
    return res.status(403).json({ error: ERRORS.SUPREME });
  }

  // If user is authenticated as a supreme user, call the next middleware
  next();
};

module.exports = { loggedIn, loggedInADM, SUPREME };
