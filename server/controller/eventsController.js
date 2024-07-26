const { default: mongoose } = require("mongoose");
const { Events_Model } = require("../models/Events");
const { Student_Model } = require("../models/Students");
const ejs = require("ejs");
const path = require("path");
const { sendEmail } = require("../useful/sendpulse");

const event_reminderEvent = async (req, res) => {
  const { id } = req.params;
  const event = await Events_Model.findById(id);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const { studentID, date, time, description, link } = event;
  const student = await Student_Model.findById(studentID);

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  const { name, email } = student;

  const splitDate = date.split("-");
  const formatDate = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;

  try {
    const templatePath = path.join(__dirname, "../email/reminderClass.ejs");
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

        const text = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;
        const subject = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;

        try {
          sendEmail(htmlMessage, text, subject, name, email);
          sendEmail(
            `Lembrete de aula do(a) aluno(a) ${name} enviado. ${formatDate}`,
            `Lembrete de aula do(a) aluno(a) ${name} enviado. ${formatDate}`,
            `Lembrete de aula do(a) aluno(a) ${name} enviado. ${formatDate}`,
            "Arthur",
            "arthurcardosocorp@gmail.com"
          );
          console.log("Email enviado com sucesso");
          res.status(200).json({ message: "Email enviado com sucesso" });

          event.emailSent = true;
          await event.save();
        } catch (emailError) {
          console.error("Erro ao enviar o email:", emailError);
          res.status(500).json({ error: "Erro ao enviar o email" });
        }
      }
    );
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};

const event_reminderEventAutomatic = async (req, res) => {
  const now = new Date();

  function get2last(numberString) {
    numberString = "0" + numberString;
    const finalResult = numberString.substring(numberString.length - 2);
    return finalResult;
  }

  const convertDate =
    now.getFullYear() +
    "-" +
    get2last(now.getMonth() + 1) +
    "-" +
    get2last(now.getDate());

  const events = await Events_Model.find({ date: convertDate });

  if (events.length == 0) {
    return res.status(404).json({ error: "Event not found" });
  }

  for (let event of events) {
    const { studentID, date, time, description, link, category } = event;
    const [eventHour] = time.split(":").map(Number);
    const test =
      category !== "Group Class" &&
      category !== "Test" &&
      category !== "Standalone";
    if (now.getHours() + 1 !== eventHour && test) {
      continue;
    }
    const student = await Student_Model.findById(studentID);

    if (!student) {
      continue;
    }

    const { name, email } = student;

    const splitDate = date.split("-");
    const formatDate = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;

    try {
      const templatePath = path.join(__dirname, "../email/reminderClass.ejs");
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

          const text = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;
          const subject = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;

          try {
            if (event.status !== "desmarcado") {
              sendEmail(htmlMessage, text, subject, name, email);
              sendEmail(
                `Aula de ${name} às ${formatDate} às ${time}. E-mail enviado`,
                `${text} - ${name} às ${formatDate} às ${time}. E-mail enviado`,
                `${subject} - ${name}, ${formatDate}, ${time}.`,
                name,
                "arthurcardosocorp@gmail.com"
              );
              console.log(`Email de ${name} enviado com sucesso`);
              res.status(200).json({ message: "Email enviado com sucesso" });

              event.emailSent = true;
              await event.save();
            } else {
              sendEmail(
                `Aula de ${name} às ${formatDate} às ${time}. E-mail não enviado devido a cancelamento`,
                `${text} - ${name} às ${formatDate} às ${time}. E-mail não enviado devido a cancelamento`,
                `${subject} - ${name}, ${formatDate}, ${time}.`,
                name,
                "arthurcardosocorp@gmail.com"
              );
            }
          } catch (emailError) {
            console.error("Erro ao enviar o email:", emailError);
            res.status(500).json({ error: "Erro ao enviar o email" });
          }
        }
      );
    } catch (error) {
      console.error("Erro ao processar o pedido:", error);
      res.status(500).json({ error: "Erro ao processar o pedido" });
    }
  }
};

module.exports = {
  event_reminderEvent,
  event_reminderEventAutomatic,
};
