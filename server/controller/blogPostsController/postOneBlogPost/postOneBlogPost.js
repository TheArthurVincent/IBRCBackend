const { Blog_Model } = require("../../../models/Posts");
const { sendEmail } = require("../../../useful/sendpulse");

/**
 * @description Cria um novo post de blog com base nos dados fornecidos no corpo da solicitação.
 * Se o post for criado com sucesso, envia um e-mail de notificação e retorna uma resposta com o post criado.
 * @param {Object} req - O objeto de solicitação (request) da API, contendo os dados do corpo da solicitação.
 * @param {Object} res - O objeto de resposta (response) da API.
 * @async
 * @function blogPosts_postOne
 * @returns {Promise<void>} Não retorna nada explicitamente, mas envia uma resposta ao cliente.
 */
const blogPosts_post1 = async (req, res) => {
  // Desestrutura os dados do corpo da solicitação
  const { title, videoUrl, text, img } = req.body;

  try {
    // Verifica se já existe um post com o mesmo título
    const existingTitle = await Blog_Model.findOne({ title });

    // Verifica se os campos obrigatórios estão presentes
    if (!title || !text) {
      return res.status(400).json({ message: "Informações faltantes" });
    }

    // Verifica se o título já está em uso
    if (existingTitle) {
      return res.status(400).json({ message: "Escolha outro título, este já existe." });
    }

    // Cria um novo post com os dados fornecidos
    const newBlogPost = new Blog_Model({
      title,
      videoUrl,
      text,
      img,
    });

    // Tenta enviar um e-mail de notificação sobre o novo post
    try {
      sendEmail(text, title, title, "Arthur", "arthurcardosocorp@gmail.com");
      console.log("Email enviado com sucesso");
    } catch (emailError) {
      console.error("Erro ao enviar o email:", emailError);
    }

    // Salva o novo post na base de dados
    await newBlogPost.save();

    // Envia uma resposta confirmando a criação do post
    res.status(201).json({
      status: "Post criado!",
      newBlogPost,
    });
  } catch (error) {
    // Log do erro no console para debugging
    console.error(error);

    // Envia uma resposta de erro ao cliente em caso de falha na criação do post
    res.status(500).send("Falha ao criar o blog post");
  }
};

module.exports = { blogPosts_post1 };
