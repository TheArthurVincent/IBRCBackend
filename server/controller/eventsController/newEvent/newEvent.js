const { Student_Model } = require("../../../models/Students");
const { Events_Model } = require("../../../models/Events"); // Certifique-se de que este import está presente

/**
 * Handler function to create a new event and save it to the database.
 *
 * @param {Object} req - The request object containing the event details in the body.
 * @param {Object} res - The response object used to send the result back to the client.
 *
 * @returns {void} - Sends a JSON response with the status of the event creation or an error message.
 */
const event_NewEvent = async (req, res) => {
    // Extrai informações do corpo da requisição.
    const { studentID, link, date, time, category, description } = req.body;

    try {
        // Verifica se as informações essenciais estão presentes.
        if (!link || !date || !category) {
            // Retorna um erro de solicitação incorreta se informações faltarem.
            return res.status(400).json({ error: "Informações faltantes" });
        }

        // Inicializa o nome do estudante como null por padrão.
        let studentName = null;

        // Se o studentID for fornecido, busca o estudante correspondente.
        if (studentID) {
            const student = await Student_Model.findById(studentID);
            if (student) {
                // Concatena o nome e o sobrenome do estudante.
                studentName = `${student.name} ${student.lastname}`;
            } else {
                // Retorna um erro se o estudante não for encontrado.
                return res.status(404).json({ error: "Estudante não encontrado" });
            }
        }

        // Cria um novo evento com as informações fornecidas.
        const newEvent = new Events_Model({
            studentID,
            student: studentName,
            description,
            link,
            date,
            time,
            category,
        });

        // Salva o novo evento no banco de dados.
        await newEvent.save();

        // Responde com uma mensagem de sucesso e o evento criado.
        res.status(200).json({
            message: "Aula marcada",
            newEvent,
        });
    } catch (error) {
        // Registra o erro no console e responde com um erro interno do servidor.
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Evento não registrado" });
    }
};

module.exports = { event_NewEvent };
