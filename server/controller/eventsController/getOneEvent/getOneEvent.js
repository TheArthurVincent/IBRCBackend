// Importa o modelo de eventos do diretório de modelos.
const { Events_Model } = require("../../../models/Events");

/**
 * Handler function to fetch a single event by its ID.
 *
 * @param {Object} req - The request object containing URL parameters.
 * @param {Object} res - The response object used to send the result back to the client.
 *
 * @returns {void} - Sends a JSON response with the event data or an error message.
 */
const events_see1Event = async (req, res) => {
    // Extrai o ID do evento a partir dos parâmetros da URL.
    const { id } = req.params;
    
    try {
        // Busca o evento no banco de dados pelo ID fornecido.
        const event = await Events_Model.findById(id);

        // Se o evento não for encontrado, o findById retorna null.
        // Envia o evento encontrado ou uma mensagem de erro.
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Responde com o evento encontrado.
        res.status(200).json({ event });
    } catch (error) {
        // Registra o erro no console e responde com um erro interno do servidor.
        console.error("Error fetching event:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Exporta a função para que possa ser utilizada em outros módulos.
module.exports = { events_see1Event };
