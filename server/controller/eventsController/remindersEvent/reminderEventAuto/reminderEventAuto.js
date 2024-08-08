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

  // Retorna um erro 200 se não houver eventos para a data atual.
  if (events.length === 0) {
    sendEmail(
      "Nenhum email enviado agora",
      "Nenhum e-mail enviado agora",
      "Não há nenhum email agora",
      "Arthur",
      "arthurcardosocorp@gmail.com"
    );
    return res.status(200).json({ message: "Nenhum e-mail enviado." });
  }

  // Itera sobre cada evento para enviar lembretes.
  for (let event of events) {
    const { studentID, date, time, description, link, category, status } =
      event;
    const [eventHour] = time.split(":").map(Number);

    // Verifica se a hora atual está dentro do intervalo de lembrete e se a categoria é válida.
    const nowPlusOneHour = now.getHours() + 1;
    //  (*true* é não avançar)
    const test = nowPlusOneHour !== eventHour; /// a hora é diferente de daqui a 1h? Tem q ser true, pois a hora do evento é dentro da próxima hora
    const test2 =
      category === "Group Class" ||
      category === "Test" ||
      category === "Standalone"; // é um dos 3 tipos? tem q ser false, se for 1 desses da true, não é pra seguir
    const test3 = status === "desmarcado"; // está desmarcado? tem q ser false, pois se estiver desmarcado nao é pra mandar
    const nextOrNot = test || test2 || test3;

    // se o evento não for na próxima hora, ou se ele for uma das categorias acima, quebra o loop.
    if (nextOrNot) {
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
      const templatePath = path.join(
        __dirname,
        "../../../../email/reminderClass.ejs"
      );

      // Renderiza o template EJS com os dados do evento.
      ejs.renderFile(
        templatePath,
        { name, date: formatDate, time, description, link },
        async (err, htmlMessage) => {
          if (err) {
            console.error("Erro ao renderizar o template:", err);
            return res
              .status(500)
              .json({ error: "Erro ao renderizar o template" });
          }

          // Texto e assunto do e-mail.
          const text = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;
          const subject = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;

          try {
            // Envia o e-mail de lembrete para o estudante.
            sendEmail(htmlMessage, text, subject, name, email);
            // Envia uma notificação sobre o envio do e-mail.
            sendEmail(
              htmlMessage,
              text,
              subject,
              "Arthur",
              "arthurcardosocorp@gmail.com"
            );

            // Atualiza o evento para marcar que o e-mail foi enviado.
            event.emailSent = true;
            await event.save();
            // Retorna uma resposta de sucesso.
            console.log(`Email de ${name} enviado com sucesso`);
            return res
              .status(200)
              .json({ message: "Email enviado com sucesso" });
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
