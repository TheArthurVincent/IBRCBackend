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

const event_reminderGroupClassAutomatic = async (req, res) => {
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

  const events = await Events_Model.find({
    date: convertDate,
    category: "Group Class",
  });

  if (events.length == 0) {
    return res.status(404).json({ error: "Event not found" });
  }

  try {
    for (let event of events) {
      const { date, time, description, link } = event;
      const [eventHour] = time.split(":").map(Number);
      // if (now.getHours() + 3 !== eventHour) { continue }
      const students = await Student_Model.find();

      const emailPromises = students.map((student) => {
        const { name, email } = student;
        const splitDate = date.split("-");
        const formatDate = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
        const templatePath = path.join(
          __dirname,
          "../email/reminderLiveClass.ejs"
        );

        return new Promise((resolve, reject) => {
          ejs.renderFile(
            templatePath,
            { name, date: formatDate, time, description, link },
            async (err, htmlMessage) => {
              if (err) {
                console.error("Erro ao renderizar o template:", err);
                return reject(new Error("Erro ao renderizar o template"));
              }
              const text = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;
              const subject = `Lembrete da aula particular do dia ${formatDate}, às ${time}!`;
              try {
                await sendEmail(htmlMessage, text, subject, name, email);
                console.log(`Email de ${name} enviado com sucesso`);
                resolve();
              } catch (emailError) {
                console.error(`Erro ao enviar o email: ${name}`, emailError);
                reject(new Error(`Erro ao enviar o email: ${name}`));
              }
            }
          );
        });
      });

      await Promise.all(emailPromises);
    }

    // Enviar email de confirmação ao professor após todos os emails serem enviados
    await sendEmail(
      "Email do group Class",
      "text",
      "Group Class Sent",
      "Teacher Arthur",
      "arthurcardosocorp@gmail.com"
    );

    res
      .status(200)
      .json({ message: "Emails da aula em grupo enviados com sucesso" });
  } catch (error) {
    console.error("Erro ao enviar os emails:", error);
    res.status(500).json({ error: "Erro ao enviar os emails" });
  }
};

const events_editOneTutoring = async (req, res) => {
  const { id, day, time, link, studentID } = req.body;
  try {
    if (!id || !day || !time || !link || !studentID) {
      return res.status(400).json({ message: "Informações faltantes" });
    }

    const student = await Student_Model.findById(studentID);
    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    student.tutoringDays = student.tutoringDays.filter(
      (tutoring) => tutoring.id.toString() !== id
    );

    const newTutoring = {
      day,
      time,
      link,
      id: new mongoose.Types.ObjectId(),
    };
    student.tutoringDays.push(newTutoring);

    await student.save();
    if (id) {
      await Events_Model.deleteMany({
        tutoringID: id,
        edited: false,
      });
      const getNextDayOfWeek = (dayOfWeek, fromDate) => {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const targetDay = daysOfWeek.indexOf(dayOfWeek);
        const currentDay = fromDate.getDay();
        const daysUntilTarget = targetDay - currentDay;
        const nextDate = new Date(fromDate);
        nextDate.setDate(fromDate.getDate() + daysUntilTarget);
        return nextDate;
      };

      const today = new Date();
      const nextWeekDay = getNextDayOfWeek(day, today);

      const nextFewWeeks = [];
      for (let i = 0; i < 42; i++) {
        const nextWeek = new Date(
          nextWeekDay.getTime() + 7 * 24 * 60 * 60 * 1000 * i
        );
        nextFewWeeks.push(nextWeek);
      }

      const eventsPromises = nextFewWeeks.map(async (nextWeek) => {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const nextWeekDaySameDay = new Date(nextWeek);

        nextWeekDaySameDay.setDate(
          nextWeekDaySameDay.getDate() +
            ((daysOfWeek.indexOf(day) + 7 - nextWeekDaySameDay.getDay()) % 7)
        );

        const eventDate = new Date(
          nextWeekDaySameDay.getFullYear(),
          nextWeekDaySameDay.getMonth(),
          nextWeekDaySameDay.getDate(),
          time.split(":")[0],
          time.split(":")[1]
        );

        const formatTime = (timeStr) => {
          const [hours, minutes] = timeStr.split(":");
          return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
        };

        const newEvents = await Events_Model({
          studentID,
          student: student.name + " " + student.lastname,
          description: null,
          link,
          date: eventDate.toISOString().slice(0, 10),
          time: formatTime(time),
          category: "Tutoring",
          tutoringID: newTutoring.id,
        });

        await newEvents.save();
        return newEvents;
      });
    }
    return res.status(200).json({ student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  event_reminderEvent,
  events_editOneTutoring,
  event_reminderEventAutomatic,
  event_reminderGroupClassAutomatic,
};
