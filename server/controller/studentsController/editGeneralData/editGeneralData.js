const { Student_Model } = require("../../../models/Students");

// Importando as funções de edição
const editName = require("./microservices/editName");
const editLastname = require("./microservices/editLastname");
const editUsername = require("./microservices/editUsername");
const editEmail = require("./microservices/editEmail");
const editGoogleDriveLink = require("./microservices/editGoogleDriveLink");
const editWeeklyClasses = require("./microservices/editWeeklyClasses");
const editPicture = require("./microservices/editPicture");
const editAddress = require("./microservices/editAddress");
const editFee = require("./microservices/editFee");
const editPhoneNumber = require("./microservices/editPhoneNumber");

// Array contendo todas as funções de edição importadas
const editFunctions = [
    editName,
    editLastname,
    editUsername,
    editEmail,
    editGoogleDriveLink,
    editWeeklyClasses,
    editPicture,
    editAddress,
    editFee,
    editPhoneNumber
];

/**
 * Função assíncrona para editar os dados gerais de um aluno.
 * @param {Object} req - Objeto da requisição HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 * @returns {Promise<void>} - Promessa vazia.
 */
const student_editGeneralData = async (req, res) => {
    const { id } = req.params;

    // Extrair os campos do corpo da requisição
    const {
        name,
        lastname,
        username,
        email,
        fee,
        address,
        weeklyClasses,
        googleDriveLink,
        picture,
        phoneNumber,
    } = req.body;

    try {
        // Encontrar o aluno pelo ID
        const studentToEdit = await Student_Model.findById(id);
        if (!studentToEdit) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        // Array de promessas de edição dos campos do aluno
        const editPromises = editFunctions.map(editFunction => {
            switch (editFunction) {
                case editName:
                    return editName(studentToEdit, name); // Editar o nome do aluno
                case editLastname:
                    return editLastname(studentToEdit, lastname); // Editar o sobrenome do aluno
                case editUsername:
                    return editUsername(studentToEdit, username); // Editar o nome de usuário do aluno
                case editEmail:
                    return editEmail(studentToEdit, email); // Editar o email do aluno
                case editGoogleDriveLink:
                    return editGoogleDriveLink(studentToEdit, googleDriveLink); // Editar o link do Google Drive do aluno
                case editWeeklyClasses:
                    return editWeeklyClasses(studentToEdit, weeklyClasses); // Editar as aulas semanais do aluno
                case editPicture:
                    return editPicture(studentToEdit, picture); // Editar a foto do aluno
                case editAddress:
                    return editAddress(studentToEdit, address); // Editar o endereço do aluno
                case editFee:
                    return editFee(studentToEdit, fee); // Editar a taxa do aluno
                case editPhoneNumber:
                    return editPhoneNumber(studentToEdit, phoneNumber); // Editar o número de telefone do aluno
                default:
                    return null; // Caso não haja correspondência, retorna null
            }
        });

        // Executar todas as promessas de edição em paralelo
        const editResults = await Promise.all(editPromises);

        // Filtrar quais campos foram efetivamente alterados
        const changedFields = editResults.filter(result => result !== null);

        // Se nenhum campo foi alterado, retornar uma mensagem informativa
        if (changedFields.length === 0) {
            return res.json({
                message: `Nenhuma edição feita no usuário ${studentToEdit.username}`,
            });
        }

        // Salvar as alterações no aluno
        await studentToEdit.save();

        // Responder com sucesso e os detalhes das alterações realizadas
        res.status(200).json({
            message: "Aluno editado com sucesso",
            changedFields,
            updatedUser: studentToEdit,
        });
    } catch (error) {
        console.error("Erro ao editar aluno:", error);
        res.status(500).send("Erro ao editar aluno");
    }
};

module.exports = { student_editGeneralData };
