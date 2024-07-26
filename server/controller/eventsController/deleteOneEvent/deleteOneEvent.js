const { Events_Model } = require("../../../models/Events");

/**
 * Controller para deletar um evento pelo ID.
 *
 * @param {Object} req - O objeto de requisição Express.
 * @param {Object} res - O objeto de resposta Express.
 * @returns {Promise<void>} - Uma Promise que resolve quando a resposta for enviada.
 */
const events_delete1Event = async (req, res) => {
    // Obtém o ID do evento a partir dos parâmetros da requisição.
    const { id } = req.params;

    try {
        // Busca o evento pelo ID fornecido.
        const eventToDelete = await Events_Model.findById(id);

        // Verifica se o evento foi encontrado.
        if (!eventToDelete) {
            // Se o evento não for encontrado, retorna uma resposta de erro com status 404.
            return res.status(404).json("Evento não encontrado");
        } else {
            // Se o evento for encontrado, deleta o evento.
            await eventToDelete.deleteOne();
            // Retorna uma resposta de sucesso com o evento deletado.
            res.status(200).json({ message: "Success!", eventToDelete });
        }
    } catch (error) {
        // Em caso de erro na operação, retorna uma resposta de erro com status 500.
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { events_delete1Event };
