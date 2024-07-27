const { Blog_Model } = require("../../../models/Posts");

/**
 * @description Edita um post específico do blog com base no ID fornecido na URL.
 * Atualiza os campos do post com os dados fornecidos no corpo da solicitação.
 * @param {Object} req - O objeto de solicitação (request) da API, contendo os parâmetros da URL e o corpo da solicitação.
 * @param {Object} res - O objeto de resposta (response) da API.
 * @async
 * @function blogPosts_edit1
 * @returns {Promise<void>} Não retorna nada explicitamente, mas envia uma resposta ao cliente.
 */
const blogPosts_edit1 = async (req, res) => {
  // Desestrutura os dados do corpo da solicitação
  const { title, videoUrl, text, img } = req.body;

  try {
    // Desestrutura o ID dos parâmetros da URL
    const { id } = req.params;

    // Recupera o post específico pelo ID fornecido na URL
    const postToEdit = await Blog_Model.findById(id);

    // Verifica se o post existe
    if (!postToEdit) {
      // Se o post não for encontrado, envia uma resposta com status 404
      return res.status(404).json({ message: "Post não encontrado" });
    }

    // Verifica se os campos obrigatórios estão presentes
    if (!title || !text) {
      // Se campos obrigatórios estiverem faltando, envia uma resposta com status 400
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }

    // Verifica se os dados fornecidos são iguais aos já existentes
    if (
      postToEdit.title === title &&
      postToEdit.videoUrl === videoUrl &&
      postToEdit.text === text &&
      postToEdit.img === img
    ) {
      // Se não houver alterações, envia uma resposta informando que nenhuma edição foi feita
      return res.json({
        message: `Nenhuma edição feita no post ${postToEdit.title}`,
      });
    }

    // Atualiza os campos do post com os novos dados fornecidos
    postToEdit.title = title;
    postToEdit.videoUrl = videoUrl;
    postToEdit.text = text;
    postToEdit.img = img;

    // Salva as alterações no post
    await postToEdit.save();

    // Envia uma resposta confirmando que o post foi editado com sucesso
    res.status(200).json({
      message: "Post editado com sucesso",
      updatedPost: postToEdit,
    });
  } catch (error) {
    // Log do erro no console para debugging
    console.error(error);

    // Envia uma resposta de erro ao cliente em caso de falha na edição do post
    res.status(500).json({ message: "Falha ao editar o post" });
  }
};

module.exports = { blogPosts_edit1 };
