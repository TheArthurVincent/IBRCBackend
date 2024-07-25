const { Blog_Model } = require("../../../models/Posts");

/**
 * @description Exclui um post específico do blog com base no ID fornecido na URL.
 * @param {Object} req - O objeto de solicitação (request) da API, contendo os parâmetros da URL.
 * @param {Object} res - O objeto de resposta (response) da API.
 * @async
 * @function blogPosts_deleteOne
 * @returns {Promise<void>} Não retorna nada explicitamente, mas envia uma resposta ao cliente.
 */
const blogPosts_deleteOne = async (req, res) => {
  try {
    // Recupera o post específico pelo ID fornecido na URL
    const blogPost = await Blog_Model.findById(req.params.id);

    // Verifica se o post existe
    if (!blogPost) {
      // Se o post não existir, envia uma resposta com status 404
      return res.status(404).json({ message: "Post não existe" });
    } else {
      // Exclui o post da base de dados
      await blogPost.deleteOne();

      // Envia uma resposta confirmando a exclusão do post
      res.status(200).json({
        status: "Post excluído",
      });
    }
  } catch (error) {
    // Envia uma resposta de erro ao cliente em caso de falha na exclusão do post
    res.status(500).json({
      erro: "Falha ao excluir post!",
      status: error.message, // Inclui a mensagem de erro específica
    });
  }
};

module.exports = { blogPosts_deleteOne };
