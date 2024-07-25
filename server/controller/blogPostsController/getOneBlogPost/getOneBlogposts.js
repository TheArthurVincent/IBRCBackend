const { Blog_Model } = require("../../../models/Posts");

/**
 * @description Recupera um post específico do blog com base no ID fornecido na URL.
 * @param {Object} req - O objeto de solicitação (request) da API, contendo os parâmetros da URL.
 * @param {Object} res - O objeto de resposta (response) da API.
 * @async
 * @function blogPosts_getOne
 * @returns {Promise<void>} Não retorna nada explicitamente, mas envia uma resposta ao cliente.
 */
const blogPosts_getOne = async (req, res) => {
  try {
    // Recupera o post específico pelo ID fornecido na URL
    const blogPost = await Blog_Model.findById(req.params.id);

    // Verifica se o post foi encontrado
    if (!blogPost) {
      // Se o post não for encontrado, envia uma resposta com status 404
      return res.status(404).json({ message: "Post não encontrado" });
    }

    // Formata os dados do post para enviar na resposta
    const formattedBlogPost = {
      id: blogPost._id,
      title: blogPost.title,
      videoUrl: blogPost.videoUrl,
      text: blogPost.text,
    };

    // Envia uma resposta com o post encontrado
    res.status(200).json({
      status: "Post encontrado",
      formattedBlogPost,
    });
  } catch (error) {
    // Log do erro no console para debugging
    console.error(error);

    // Envia uma resposta de erro ao cliente em caso de falha na recuperação do post
    res.status(500).send("Erro ao recuperar o post");
  }
};

module.exports = { blogPosts_getOne };
