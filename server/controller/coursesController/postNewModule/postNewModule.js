const { ModulesInfo_Model } = require("../../../models/CourseClass");

/**
 * Adiciona um novo módulo a um curso específico no banco de dados.
 * 
 * @param {Object} req - O objeto de requisição Express, contendo os dados do novo módulo no corpo da requisição.
 * @param {Object} res - O objeto de resposta Express, usado para retornar a resposta HTTP.
 * 
 * @returns {void} - Retorna uma resposta HTTP com o novo módulo adicionado ou um erro se ocorrer.
 */
const courseClasses_post1NewModule = async (req, res) => {
    // Extrai os dados do novo módulo do corpo da requisição
    const { title, order, courseId } = req.body;

    try {
        // Obtém todos os módulos existentes para o curso especificado
        const ExistingModules = await ModulesInfo_Model.find({ courseId });

        // Define a ordem do novo módulo, usando o próximo número disponível se `order` não for fornecido
        const newOrder = order !== undefined ? order : ExistingModules.length;

        // Cria uma nova instância do modelo de módulo com os dados fornecidos
        const newModule = new ModulesInfo_Model({
            title,
            courseId,
            order: newOrder,
        });

        // Salva o novo módulo no banco de dados
        await newModule.save();

        // Retorna a resposta com status 201 e o novo módulo criado
        res.status(201).json(newModule);
    } catch (error) {
        // Retorna um erro com status 400 se houver problemas ao criar o módulo
        res.status(400).json({
            status: "Uma ou mais aulas não foram postadas",
            message: error.message,
        });
    }
};

module.exports = { courseClasses_post1NewModule };
