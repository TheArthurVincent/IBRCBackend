const ejs = require("ejs");
const path = require("path");
const { Events_Model } = require("../../../../models/Events");
const { Student_Model } = require("../../../../models/Students");
const { sendEmail } = require("../../../../useful/sendpulse");


/**
 * Controlador para enviar um lembrete por e-mail sobre um evento específico.
 * 
 * @param {Object} req - O objeto de requisição Express contendo os parâmetros da URL.
 * @param {Object} res - O objeto de resposta Express usado para retornar a resposta ao cliente.
 * @returns {Promise<void>} - Uma Promise que resolve quando a resposta for enviada.
 */
const event_reminderEvent = async (req, res) => {
    // Extrai o ID do evento dos parâmetros da URL.
    const { id } = req.params;

    // Busca o evento pelo ID fornecido.
    const event = await Events_Model.findById(id);

    // Se o evento não for encontrado, retorna um erro 404.
    if (!event) {
        return res.status(404).json({ error: "Event not found" });
    }

    // Desestrutura as propriedades relevantes do evento.
    const { studentID, date, time, description, link } = event;

    // Busca o estudante associado ao evento.
    const student = await Student_Model.findById(studentID);

    // Se o estudante não for encontrado, retorna um erro 404.
    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }

    // Desestrutura as propriedades do estudante.
    const { name, email } = student;

    // Formata a data no formato DD/MM/YYYY para uso no e-mail.
    const splitDate = date.split("-");
    const formatDate = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;

    try {
        // Define o caminho para o template EJS do lembrete de aula.
        const templatePath = path.join(__dirname, "../../../../email/reminderClass.ejs");

        // Renderiza o template EJS com os dados do evento.
        ejs.renderFile(
            templatePath,
            { name, date: formatDate, time, description, link },
            async (err, htmlMessage) => {
                // Se ocorrer um erro ao renderizar o template, retorna um erro 500.
                if (err) {
                    console.error("Erro ao renderizar o template:", err);
                    return res.status(500).json({ error: "Erro ao renderizar o template" });
                }

                // Define o texto e o assunto do e-mail.
                const text = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;
                const subject = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;

                try {
                    // Envia o e-mail de lembrete para o estudante.
                    sendEmail(htmlMessage, text, subject, name, email);

                    // Envia uma notificação sobre o envio do e-mail.
                    sendEmail(
                        `Lembrete de aula do(a) aluno(a) ${name} enviado. ${formatDate}`,
                        `Lembrete de aula do(a) aluno(a) ${name} enviado. ${formatDate}`,
                        `Lembrete de aula do(a) aluno(a) ${name} enviado. ${formatDate}`,
                        "Arthur",
                        "arthurcardosocorp@gmail.com"
                    );

                    console.log("Email enviado com sucesso");

                    // Atualiza o evento para marcar que o e-mail foi enviado.
                    event.emailSent = true;
                    await event.save();

                    // Retorna uma resposta de sucesso.
                    res.status(200).json({ message: "Email enviado com sucesso" });
                } catch (emailError) {
                    // Se ocorrer um erro ao enviar o e-mail, retorna um erro 500.
                    console.error("Erro ao enviar o email:", emailError);
                    res.status(500).json({ error: "Erro ao enviar o email" });
                }
            }
        );
    } catch (error) {
        // Se ocorrer um erro ao processar o pedido, retorna um erro 500.
        console.error("Erro ao processar o pedido:", error);
        res.status(500).json({ error: "Erro ao processar o pedido" });
    }
};

module.exports = { event_reminderEvent };
