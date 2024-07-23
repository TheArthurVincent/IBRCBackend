const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { Student_Model } = require("../../../models/Students");

const ERRORS = {
    NO_USER_LOGGED: "NENHUM USUÁRIO LOGADO",
    USER_NOT_FOUND: "Este usuário já não existe mais",
    PASSWORD_CHANGED: "Você recentemente mudou sua senha. Faça login novamente",
    NOT_ADMIN: "Você não é administrador!!",
    INVALID_LOGIN:
        "Você não está logado de maneira válida, portanto não pode executar esta rota",
};

const verifyToken = async (token) => {
    try {
        return await promisify(jwt.verify)(token, "secretToken()");
    } catch (error) {
        throw new Error(ERRORS.INVALID_LOGIN);
    }
};

const getUser = async (userId) => {
    try {
        return await Student_Model.findById(userId);
    } catch (error) {
        throw new Error(ERRORS.USER_NOT_FOUND);
    }
};

const loggedIn = async (req, res, next) => {
    let { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: ERRORS.NO_USER_LOGGED });
    }

    try {
        let decoded = await verifyToken(authorization);
        let user = await getUser(decoded.id);

        if (!user) {
            return res.status(404).json({ error: ERRORS.USER_NOT_FOUND });
        }

        if (user.changedPasswordBeforeLogInAgain) {
            return res.status(403).json({ error: ERRORS.PASSWORD_CHANGED });
        }

        req.user = user; // Armazena o usuário autenticado no objeto req
        next();
    } catch (error) {
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

module.exports = { loggedIn, loggedInADM };
