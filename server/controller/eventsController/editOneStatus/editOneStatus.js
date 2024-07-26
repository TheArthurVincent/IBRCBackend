const { Events_Model } = require("../../../models/Events");

/**
 * Controller para editar o status de um evento existente.
 * 
 * @param {Object} req - O objeto de requisição Express contendo o novo status do evento e o ID do evento.
 * @param {Object} res - O objeto de resposta Express usado para retornar a resposta ao cliente.
 * @returns {Promise<void>} - Uma Promise que resolve quando a resposta for enviada.
 */
const events_edit1Status = async (req, res) => {
    // Desestrutura o status do corpo da requisição e o ID do evento dos parâmetros da requisição.
    const { status } = req.body;
    const { id } = req.params;

    try {
        // Verifica se o status foi fornecido.
        if (!status) {
            // Retorna uma resposta de erro 400 (Bad Request) se o status estiver faltando.
            return res.status(400).json({ info: "Informações faltantes" });
        }

        // Busca o evento pelo ID fornecido.
        const editedEvent = await Events_Model.findById(id);

        // Verifica se o evento foi encontrado.
        if (!editedEvent) {
            // Retorna uma resposta de erro 404 (Not Found) se o evento não for encontrado.
            return res.status(404).json({ info: "Evento não encontrado" });
        }

        // Atualiza o status do evento e marca o evento como editado.
        editedEvent.status = status;
        editedEvent.edited = true;

        // Salva as alterações no evento.
        await editedEvent.save();

        // Retorna uma resposta de sucesso com o evento atualizado.
        return res.status(200).json({ message: "Success!", editedEvent });
    } catch (error) {
        // Em caso de erro na operação, retorna uma resposta de erro 500 (Internal Server Error).
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { events_edit1Status };
