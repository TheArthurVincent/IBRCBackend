const { CourseInfo_Model } = require("../../../models/CourseClass");

/**
 * Adiciona um novo curso ao banco de dados.
 * 
 * @param {Object} req - O objeto de requisição Express, contendo os dados do novo curso no corpo da requisição.
 * @param {Object} res - O objeto de resposta Express, usado para retornar a resposta HTTP.
 * 
 * @returns {void} - Retorna uma resposta HTTP com o novo curso adicionado ou um erro se ocorrer.
 */
const courseClasses_post1NewCourse = async (req, res) => {
    // Extrai os dados do novo curso do corpo da requisição
    const { title, image, order } = req.body;

    try {
        // Obtém o número total de cursos existentes
        const numberOfCourses = await CourseInfo_Model.find();

        // Ajusta a ordem do novo curso, usando o próximo número disponível se `order` não for fornecido
        let adjustedOrder = order !== undefined ? order : numberOfCourses.length;

        // Verifica se já existe um curso com a mesma ordem
        const existingCourse = await CourseInfo_Model.findOne({
            order: adjustedOrder,
        });

        // Se um curso com a mesma ordem já existir, ajusta a ordem do curso existente
        if (existingCourse) {
            existingCourse.order = numberOfCourses.length;
            await existingCourse.save();
        }

        // Cria uma nova instância do modelo de curso com os dados fornecidos
        const newCourse = new CourseInfo_Model({
            title,
            image: image ? image : null,
            order: adjustedOrder,
        });

        // Salva o novo curso no banco de dados
        await newCourse.save();

        // Loga o novo curso criado (para fins de depuração)
        console.log(newCourse);

        // Retorna a resposta com status 201 e o novo curso criado
        res.status(201).json(newCourse);
    } catch (error) {
        // Retorna um erro com status 400 se houver problemas ao criar o curso
        res.status(400).json({
            status: "Curso não postado",
            message: error.message,
        });
    }
};

module.exports = { courseClasses_post1NewCourse };
