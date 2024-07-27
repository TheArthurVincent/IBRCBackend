const { CourseClass_Model } = require("../../../models/CourseClass");

/**
 * Obtém os detalhes de uma aula específica com base no ID fornecido.
 *
 * @param {Object} req - O objeto de requisição Express.
 * @param {Object} res - O objeto de resposta Express.
 *
 * @returns {void} - Retorna a resposta HTTP com os detalhes da aula ou um erro.
 */
const courseClasses_get1 = async (req, res) => {
  // Obtém o ID da aula a partir dos parâmetros da requisição
  const { id } = req.params;

  try {
    // Busca os detalhes da aula pelo ID
    const classDetails = await CourseClass_Model.findById(id);

    // Verifica se a aula foi encontrada
    if (!classDetails) {
      return res.status(404).json({ error: "Aula não encontrada" });
    }

    // Retorna os detalhes da aula como resposta
    res.json(classDetails);
  } catch (error) {
    // Loga o erro no console para diagnóstico
    console.error("Erro ao obter os detalhes da aula:", error);

    // Retorna um erro interno do servidor em caso de exceção
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = { courseClasses_get1 };
