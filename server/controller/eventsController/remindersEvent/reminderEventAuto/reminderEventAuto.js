const { Events_Model } = require("../../../../models/Events");
const { Student_Model } = require("../../../../models/Students");
const ejs = require("ejs");
const path = require("path");
const { sendEmail } = require("../../../../useful/sendpulse");

/**
 * Controlador para enviar lembretes automáticos por e-mail para eventos agendados no dia atual.
 * 
 * @param {Object} req - O objeto de requisição Express.
 * @param {Object} res - O objeto de resposta Express usado para retornar a resposta ao cliente.
 * @returns {Promise<void>} - Uma Promise que resolve quando a resposta for enviada.
 */
const event_reminderAutomatic = async (req, res) => {
    // Obtém a data e hora atuais.
    const now = new Date();

    /**
     * Função auxiliar para garantir que um número tenha sempre dois dígitos.
     * 
     * @param {string} numberString - O número como string.
     * @returns {string} - O número formatado com dois dígitos.
     */
    function get2last(numberString) {
        numberString = "0" + numberString;
        const finalResult = numberString.substring(numberString.length - 2);
        return finalResult;
    }

    // Formata a data atual no formato YYYY-MM-DD.
    const convertDate =
        now.getFullYear() +
        "-" +
        get2last(now.getMonth() + 1) +
        "-" +
        get2last(now.getDate());

    // Busca todos os eventos agendados para a data atual.
    const events = await Events_Model.find({ date: convertDate });

    // Retorna um erro 404 se não houver eventos para a data atual.
    if (events.length === 0) {
        return res.status(404).json({ error: "Event not found" });
    }

    // Itera sobre cada evento para enviar lembretes.
    for (let event of events) {
        const { studentID, date, time, description, link, category } = event;
        const [eventHour] = time.split(":").map(Number);

        // Verifica se a hora atual está dentro do intervalo de lembrete e se a categoria é válida.
        const test =
            category !== "Group Class" &&
            category !== "Test" &&
            category !== "Standalone";
        if (now.getHours() + 1 !== eventHour || test) {
            continue;
        }

        // Busca o estudante associado ao evento.
        const student = await Student_Model.findById(studentID);

        // Se o estudante não for encontrado, continua para o próximo evento.
        if (!student) {
            continue;
        }

        const { name, email } = student;

        // Formata a data no formato DD/MM/YYYY para o e-mail.
        const splitDate = date.split("-");
        const formatDate = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;

        try {
            // Caminho do template EJS para o lembrete de aula.
            const templatePath = path.join(__dirname, "../../../../email/reminderClass.ejs");

            // Renderiza o template EJS com os dados do evento.
            ejs.renderFile(
                templatePath,
                { name, date: formatDate, time, description, link },
                async (err, htmlMessage) => {
                    if (err) {
                        console.error("Erro ao renderizar o template:", err);
                        return res.status(500).json({ error: "Erro ao renderizar o template" });
                    }

                    // Texto e assunto do e-mail.
                    const text = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;
                    const subject = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;

                    try {
                        // Verifica se o evento não está desmarcado e envia o e-mail.
                        if (event.status !== "desmarcado") {
                            // Envia o e-mail de lembrete para o estudante.
                            sendEmail(htmlMessage, text, subject, name, email);

                            // Envia uma notificação sobre o envio do e-mail.
                            sendEmail(
                                `Aula de ${name} às ${formatDate} às ${time}. E-mail enviado`,
                                `${text} - ${name} às ${formatDate} às ${time}. E-mail enviado`,
                                `${subject} - ${name}, ${formatDate}, ${time}.`,
                                name,
                                "arthurcardosocorp@gmail.com"
                            );

                            
                            // Atualiza o evento para marcar que o e-mail foi enviado.
                            event.emailSent = true;
                            await event.save();
                            
                            // Retorna uma resposta de sucesso.
                            console.log(`Email de ${name} enviado com sucesso`);
                            return res.status(200).json({ message: "Email enviado com sucesso" });
                        } else {
                            // Envia uma notificação de não envio do e-mail devido ao cancelamento.
                            sendEmail(
                                `Aula de ${name} às ${formatDate} às ${time}. E-mail não enviado devido a cancelamento`,
                                `${text} - ${name} às ${formatDate} às ${time}. E-mail não enviado devido a cancelamento`,
                                `${subject} - ${name}, ${formatDate}, ${time}.`,
                                name,
                                "arthurcardosocorp@gmail.com"
                            );
                            console.log(`Email de ${name} não enviado pois houve cancelamento`);
                            return res.status(200).json({ message: "Email não enviado com sucesso" });
                        }
                    } catch (emailError) {
                        console.error("Erro ao enviar o email:", emailError);
                        return res.status(500).json({ error: "Erro ao enviar o email" });
                    }
                }
            );
        } catch (error) {
            console.error("Erro ao processar o pedido:", error);
            return res.status(500).json({ error: "Erro ao processar o pedido" });
        }
    }
};

module.exports = { event_reminderAutomatic };
