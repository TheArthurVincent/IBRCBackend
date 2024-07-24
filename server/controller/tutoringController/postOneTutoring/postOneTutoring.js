/**
 * Create and save tutoring sessions and related homework assignments,
 * and send notification emails to students.
 * @param {object} req - Express request object containing body data.
 * @param {object} res - Express response object for sending responses.
 * @returns {object} JSON response confirming successful creation of tutoring sessions.
 */
const ejs = require("ejs");
const path = require("path");
const { Homework_Model } = require("../../../models/Homework");
const { Student_Model } = require("../../../models/Students");
const { sendEmail } = require("../../../useful/sendpulse");
const { Tutoring_Model } = require("../../../models/Tutoring");

const tutoring_postOne = async (req, res) => {
  const { tutorings, description, dueDate } = req.body;
  const savedTutorings = [];

  try {
    // Iterate through each tutoring session provided in the request body
    for (const tutoring of tutorings) {
      const { date, studentID, videoUrl, attachments } = tutoring;

      // Format date for display
      const parsedDate = new Date(date);
      const formattedDate = parsedDate.toLocaleDateString("pt-BR");

      // Create new tutoring session
      const newTutoring = new Tutoring_Model({
        date: formattedDate,
        videoUrl,
        studentID,
        attachments,
      });

      // Function to add one day to a given date string
      function addOneDay(dateString) {
        let date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        let newDateString = date.toISOString().split("T")[0];
        return newDateString;
      }

      // If description and dueDate are provided, create new homework assignment
      if (description && dueDate) {
        const newHomework = new Homework_Model({
          assignmentDate: addOneDay(date),
          dueDate: addOneDay(dueDate),
          videoUrl,
          studentID,
          category: "tutoring",
          googleDriveLink: attachments,
          description,
        });

        await newHomework.save();
      }

      // Find student details
      const student = await Student_Model.findById(studentID);
      const { name, lastname, email } = student;

      // Construct path to email template
      const templatePath = path.join(
        __dirname,
        "../../../email/postedClass.ejs"
      );

      // Render email template with student name and formatted date
      ejs.renderFile(
        templatePath,
        { name, formattedDate },
        (err, htmlMessage) => {
          if (err) {
            console.error("Error rendering template:", err);
            return;
          }

          // Prepare email details
          const text = `Aula particular do dia ${formattedDate} postada no portal!`;
          const subject = `Aula particular do dia ${formattedDate} postada no portal!`;
          const nameTo = name + " " + lastname;
          const emailTo = email;

          // Send email notification to student
          sendEmail(htmlMessage, text, subject, nameTo, emailTo);

          // Notify sender that email was sent
          sendEmail(
            `E-mail ao(a) aluno(a) ${nameTo} enviado.`,
            `E-mail ao(a) aluno(a) ${nameTo} enviado.`,
            `E-mail ao(a) aluno(a) ${nameTo} enviado.`,
            "Arthur",
            "arthurcardosocorp@gmail.com"
          );
        }
      );

      // Save tutoring session to database and add to savedTutorings array
      await newTutoring.save();
      savedTutorings.push(newTutoring);
    }

    // Respond with success message and list of saved tutoring sessions
    res.status(201).json({
      status: "Aula particular salva",
      savedTutorings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Erro: "Aula não registrada" });
  }
};

module.exports = { tutoring_postOne };
