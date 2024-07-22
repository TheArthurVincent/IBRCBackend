const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { Student_Model } = require("../../../models/Students");

const loggedIn = async (req, res, next) => {
    let { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ erro: "NENHUM USUÁRIO LOGADO" }); // Portuguese for "NO USER LOGGED IN"
    }

    let freshUser;
    try {
        let decoded = await promisify(jwt.verify)(authorization, "secretToken()");
        if (decoded) {
            freshUser = await Student_Model.findById(decoded.id);
        } else {
            console.log("error, no decoded or freshUser");
        }

        if (!freshUser) {
            return res.status(500).json({
                error: "Este usuário já não existe mais", // Portuguese for "This user no longer exists"
            });
        } else if (freshUser.changedPasswordBeforeLogInAgain) {
            return res.status(500).json({
                error: "Você recentemente mudou sua senha. Faça login novamente", // Portuguese for "You recently changed your password. Please log in again"
            });
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({
            error:
                "Você não está logado de maneira válida, portanto não pode executar esta rota", // Portuguese for "You are not logged in validly, so you cannot execute this route"
        });
    }
};

/**
 * Middleware function to check if an administrator user is logged in.
 *
 * Verifies the JWT token in the Authorization header to authenticate the user.
 * Checks if the authenticated user exists and has 'superadmin' permissions.
 *
 * @param {object} req - Express request object containing headers with Authorization token
 * @param {object} res - Express response object for sending HTTP responses
 * @param {function} next - Express function to pass control to the next middleware
 * @returns {void}
 */
const loggedInADM = async (req, res, next) => {
    let { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ erro: "NENHUM USUÁRIO LOGADO" }); // Portuguese for "NO USER LOGGED IN"
    }

    let freshUser;
    try {
        let decoded = await promisify(jwt.verify)(authorization, "secretToken()");
        if (decoded) {
            freshUser = await Student_Model.findById(decoded.id);
        } else {
            console.log("error, no decoded or freshUser");
        }

        if (!freshUser) {
            return res.status(500).json({
                error: "Este usuário já não existe mais", // Portuguese for "This user no longer exists"
            });
        } else if (freshUser.permissions !== "superadmin") {
            return res.status(500).json({
                error: "Você não é administrador!!", // Portuguese for "You are not an administrator!!"
            });
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({
            error:
                "Você não está logado de maneira válida, portanto não pode executar esta rota", // Portuguese for "You are not logged in validly, so you cannot execute this route"
        });
    }
};

module.exports = { loggedIn, loggedInADM };
