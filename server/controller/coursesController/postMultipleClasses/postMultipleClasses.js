const { CourseClass_Model } = require("../../../models/CourseClass");

/**
 * Adiciona várias aulas ao banco de dados a partir dos dados fornecidos na requisição.
 * 
 * @param {Object} req - O objeto de requisição Express, contendo o corpo da requisição com as aulas.
 * @param {Object} res - O objeto de resposta Express, usado para retornar a resposta HTTP.
 * 
 * @returns {void} - Retorna uma resposta HTTP com as novas aulas adicionadas ou um erro se ocorrer.
 */
const courseClasses_postMultiple = async (req, res) => {
    // Extrai as aulas do corpo da requisição
    const classes = req.body.theClass;

    // Verifica se o campo `theClass` é um array e se não está vazio
    if (!Array.isArray(classes) || classes.length === 0) {
        return res.status(400).json({ message: "Nenhuma aula fornecida" });
    }

    // Obtém todas as aulas existentes para definir a ordem das novas aulas
    const allClasses = await CourseClass_Model.find();

    try {
        // Cria e salva cada nova aula no banco de dados
        const newClasses = await Promise.all(
            classes.map(async (classItem) => {
                const {
                    title,
                    module,
                    order,
                    description,
                    image,
                    video,
                    elements,
                    courseId,
                } = classItem;

                // Define a ordem da nova aula; usa o próximo número disponível se `order` não for fornecido
                const theOrder = order ? order : allClasses.length + 1;

                // Cria uma nova instância do modelo de aula com os dados fornecidos
                const newClass = new CourseClass_Model({
                    title,
                    module,
                    order: theOrder,
                    courseId,
                    description: description
                        ? description
                        : `This class is about ${title}`,
                    image: image ? image : null,
                    video: video ? video : null,
                    elements: elements ? elements : null,
                });

                // Salva a nova aula no banco de dados
                await newClass.save();

                // Retorna a nova aula criada
                return newClass;
            })
        );

        // Retorna a resposta com status 201 e as novas aulas adicionadas
        res.status(201).json(newClasses);
    } catch (error) {
        // Retorna um erro com status 400 se uma ou mais aulas não puderem ser postadas
        res.status(400).json({
            status: "Uma ou mais aulas não foram postadas",
            message: error,
        });
    }
};

module.exports = { courseClasses_postMultiple };
