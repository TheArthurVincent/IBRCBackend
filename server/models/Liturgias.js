const mongoose = require("mongoose");
const { Schema } = mongoose;

const liturgiaSchema = new Schema({
  data: {
    type: Date,
    required: true,
  },
  liturgista: {
    type: String,
    required: false,
  },
  textoDaLiturgia: {
    type: String,
    required: false,
  },
  orador: {
    type: String,
    required: false,
  },
  preludio: {
    type: String,
    required: false,
  },
  musica1: {
    type: String,
    required: false,
  },
  musica2: {
    type: String,
    required: false,
  },
  musica3: {
    type: String,
    required: false,
  },
  musica4: {
    type: String,
    required: false,
  },
  posludio: {
    type: String,
    required: false,
  },
  preludioLink: {
    type: String,
    required: false,
  },
  musica1Link: {
    type: String,
    required: false,
  },
  musica2Link: {
    type: String,
    required: false,
  },
  musica3Link: {
    type: String,
    required: false,
  },
  musica4Link: {
    type: String,
    required: false,
  },
  posludioLink: {
    type: String,
    required: false,
  },
  pregador: {
    type: String,
    required: false,
  },
  textoDaPregacao: {
    type: String,
    required: false,
  },
  tituloDaPregacao: {
    type: String,
    required: false,
  },
  EBD1: {
    type: String,
    required: false,
  },
  professorEBD1: {
    type: String,
    required: false,
  },
  tituloEBD1: {
    type: String,
    required: false,
  },
  EBD2: {
    type: String,
    required: false,
  },
  professorEBD2: {
    type: String,
    required: false,
  },
  tituloEBD2: {
    type: String,
    required: false,
  },
  EBD3: {
    type: String,
    required: false,
  },
  professorEBD3: {
    type: String,
    required: false,
  },
  tituloEBD3: {
    type: String,
    required: false,
  },
  EBD4: {
    type: String,
    required: false,
  },
  professorEBD4: {
    type: String,
    required: false,
  },
  tituloEBD4: {
    type: String,
    required: false,
  },
});

const Liturgia_Model = mongoose.model("Liturgia", liturgiaSchema);

module.exports = { Liturgia_Model };
