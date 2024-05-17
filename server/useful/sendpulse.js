const sendpulse = require("sendpulse-api");

// Substitua pelos valores das suas credenciais do SendPulse
const API_USER_ID = "30c7d52e21fce403e9fc12506a0f0978";
const API_SECRET = "bbc35d9aab689ddbee8541250880504b";
const TOKEN_STORAGE = "/tmp/";

// Inicializa a API do SendPulse
sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, (token) => {
  if (token) {
    console.log("SendPulse token o ar!");
  } else {
    console.error("Falha ao inicializar o SendPulse. Verifique suas credenciais.");
  }
});

// Função para enviar um email
function sendEmail(
  htmlMessage,
  text,
  subject,
  nameTo,
  emailTo
) {
  const email = {
    html: htmlMessage,
    text: text,
    subject: subject,
    from: {
      name: "Arthur Vincent",
      email: "contato@arthurvincent.com.br",
    },
    to: [
      {
        name: nameTo,
        email: emailTo,
      },
    ],
  };

  sendpulse.smtpSendMail((response) => {
    if (response.result) {
      console.log("Email enviado com sucesso:", response);
    } else {
      console.error("Erro ao enviar email:", response);
    }
  }, email);
}

// Exporte a função para uso em outros módulos
module.exports = { sendEmail };
