const { Liturgia_Model } = require("../../../models/Liturgias");

const liturgia_getAllLiturgias = async (req, res) => {
  try {
    const liturgias = await Liturgia_Model.find();
    res.status(201).json({ liturgias, status: "Liturgias encontradas" });
  } catch (error) {
    res.status(500).json({ Erro: "Nenhuma liturgia", error });
  }
};

module.exports = { liturgia_getAllLiturgias };
