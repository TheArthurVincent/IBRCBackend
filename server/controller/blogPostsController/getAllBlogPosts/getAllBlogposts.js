const { Blog_Model } = require("../../../models/Posts");

/**
 * @description Recupera todos os posts do blog da base de dados e envia uma resposta com os posts mais recentes.
 * @param {Object} req - O objeto de solicitação (request) da API.
 * @param {Object} res - O objeto de resposta (response) da API.
 * @async
 * @function blogPosts_getAll
 * @returns {Promise<void>} Não retorna nada explicitamente, mas envia uma resposta ao cliente.
 */
const blogPosts_getAll = async (req, res) => {
  try {
    // Recupera todos os posts do modelo Blog_Model
    const blogPosts = await Blog_Model.find();

    // Verifica se não há posts na base de dados
    if (blogPosts.length === 0) {
      res.status(200).json({
        message: "Nenhum post",
      });
    } else {
      // Reverte a lista de posts para obter os mais recentes no início
      const listReverse = blogPosts.reverse();

      // Seleciona os primeiros 7 posts mais recentes (se existirem)
      const listOfPosts = listReverse.slice(0, 7);

      // Envia uma resposta com os posts encontrados
      res.status(200).json({
        status: "Blog Posts encontrados",
        numberOfPosts: blogPosts.length,
        listOfPosts,
      });
    }
  } catch (error) {
    // Log do erro no console para debugging
    console.error(error);

    // Envia uma resposta de erro ao cliente
    res.status(500).json({
      error: "Erro interno do servidor",
      listOfPosts: "Nenhum post encontrado",
    });
  }
};

module.exports = { blogPosts_getAll };
