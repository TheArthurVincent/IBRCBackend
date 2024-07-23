// Importa o modelo HistoryRanking_Model do diretório especificado
const { HistoryRanking_Model } = require("../../../../models/HistoryRanking");

/**
 * Função assíncrona para adicionar um novo item de classificação de estudante.
 * @param {object} req - Objeto de requisição do Express contendo os dados do corpo da requisição.
 * @param {object} res - Objeto de resposta do Express para enviar a resposta.
 */
const student_newRankingItem = async (req, res) => {
  // Extrai o scoreMonth do corpo da requisição
  const { scoreMonth } = req.body;

  try {
    // Verifica se o scoreMonth está presente
    if (scoreMonth) {
      // Cria uma nova instância do modelo HistoryRanking_Model com o score fornecido
      const score = new HistoryRanking_Model({ score: scoreMonth });

      // Salva a instância no banco de dados
      score.save();

      // Envia uma resposta de sucesso com status 200 e os dados do score salvo
      res.status(200).json({ score, message: "Sucesso" });
    } else {
      // Envia uma resposta de erro com status 500 se o scoreMonth não estiver presente
      res.status(500).json({ error: "Ocorreu um erro", e: "Ocorreu um erro " });

      // Lança um erro para ser capturado pelo catch
      throw new Error();
    }
  } catch (error) {
    // Loga o erro no console para depuração
    console.error(error);

    // Envia uma resposta de erro com status 500 e detalhes do erro
    res.status(500).json({ error: error, e: "Ocorreu um erro " });
  }
};

// Exporta a função student_newRankingItem para uso em outros módulos
module.exports = { student_newRankingItem };
