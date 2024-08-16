const { Liturgia_Model } = require("../../../models/Liturgias");

const liturgia_getOne = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(500).json({ Erro: "id faltando", error });
    }

    try {
        const liturgiaExistente = await Liturgia_Model.findById(id);
        res.status(201).json({ liturgiaExistente, status: "Liturgia registrada", });
    } catch (error) {
        res.status(500).json({ Erro: "Liturgia não encontrada", error });
    }
};

module.exports = { liturgia_getOne };
