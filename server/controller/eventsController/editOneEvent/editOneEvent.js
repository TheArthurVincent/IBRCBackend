const { Events_Model } = require("../../../models/Events");
const { Student_Model } = require("../../../models/Students");

/**
 * Controller para editar um evento existente pelo ID.
 * 
 * @param {Object} req - O objeto de requisição Express contendo os dados para atualizar o evento.
 * @param {Object} res - O objeto de resposta Express usado para retornar a resposta ao cliente.
 * @returns {Promise<void>} - Uma Promise que resolve quando a resposta for enviada.
 */
const events_edit1Event = async (req, res) => {
    // Desestrutura os campos do corpo da requisição.
    const { category, studentID, date, time, link, description, status } = req.body;
    // Obtém o ID do evento a partir dos parâmetros da requisição.
    const { id } = req.params;

    try {
        // Busca o evento pelo ID fornecido.
        const editedEvent = await Events_Model.findById(id);
        // Se um studentID foi fornecido, busca o estudante correspondente.
        const student = studentID ? await Student_Model.findById(studentID) : null;
        // Obtém o nome completo do estudante se um studentID foi fornecido.
        const studentName = studentID ? student.name + " " + student.lastname : null;

        // Verifica se todos os campos necessários foram fornecidos e se o evento foi encontrado.
        if (!date || !link || !category || !status || !editedEvent) {
            // Se informações estão faltando ou o evento não foi encontrado, retorna um erro.
            return res.status(400).json({ info: "Informações faltantes ou evento não encontrado" });
        } else {
            // Atualiza os campos do evento com os novos valores fornecidos.
            editedEvent.category = category;
            editedEvent.studentID = studentID || null; // Define studentID como null se não fornecido.
            editedEvent.student = studentID ? studentName : null; // Define o nome do estudante se um studentID foi fornecido.
            editedEvent.date = date;
            editedEvent.time = time;
            editedEvent.link = link;
            editedEvent.edited = true; // Marca o evento como editado.
            editedEvent.description = description || ""; // Define a descrição como uma string vazia se não fornecida.
            editedEvent.status = status;

            // Salva as alterações no evento.
            await editedEvent.save();

            // Retorna uma resposta de sucesso com o evento atualizado.
            res.status(200).json({ message: "Success!", editedEvent });
        }
    } catch (error) {
        // Em caso de erro na operação, retorna uma resposta de erro com status 500.
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { events_edit1Event };
