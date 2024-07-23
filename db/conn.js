const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://actualvincent:VRdsUMFo8rJ70KKX@arvin.aotxd5a.mongodb.net/?retryWrites=true&w=majority",
      // "mongodb+srv://devtestarvin:SolusChristus%232024@cluster0.3cyvcjn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      }
    );
    
    console.log("MONGO: Banco de dados ARVIN conectado com sucesso");
  } catch (e) {
    console.error(`Erro na conexão com o MongoDB: ${e}`);
  }
}

module.exports = main;
// HoKUnIXu31bJ3P1g --> actual-vincent
// "mongodb+srv://arthurcardosocorp:lu4FZOZIo3Jwn33z@arvin.aotxd5a.mongodb.net/?retryWrites=true&w=majority",
// mongosh "mongodb+srv://cluster0.3cyvcjn.mongodb.net/" --apiVersion 1 --username <username>
