const { Liturgia_Model } = require("../../../models/Liturgias");

const liturgia_New = async (req, res) => {
    const {
        data,
        liturgista,
        textoDaLiturgia,
        orador,
        preludio,
        musica1,
        musica2,
        musica3,
        musica4,
        posludio,
        preludioLink,
        musica1Link,
        musica2Link,
        musica3Link,
        musica4Link,
        posludioLink,
        pregador,
        textoDaPregacao,
        tituloDaPregacao,
        EBD1,
        professorEBD1,
        tituloEBD1,
        EBD2,
        professorEBD2,
        tituloEBD2,
        EBD3,
        professorEBD3,
        tituloEBD3,
        EBD4,
        professorEBD4,
        tituloEBD4,
    } = req.body;

    if (!data) {
        return res.status(500).json({ Erro: "data faltando", error });
    }

    try {
        const liturgiaExistente = await Liturgia_Model.findOne({ data: data });

        if (liturgiaExistente) {
            return res.status(400).json({ message: "Esta liturgia já existe" });
        }

        const newLiturgia = new Liturgia_Model({
            data,
            liturgista,
            textoDaLiturgia,
            orador,
            preludio,
            musica1,
            musica2,
            musica3,
            musica4,
            posludio,
            preludioLink,
            musica1Link,
            musica2Link,
            musica3Link,
            musica4Link,
            posludioLink,
            pregador,
            textoDaPregacao,
            tituloDaPregacao,
            EBD1,
            professorEBD1,
            tituloEBD1,
            EBD2,
            professorEBD2,
            tituloEBD2,
            EBD3,
            professorEBD3,
            tituloEBD3,
            EBD4,
            professorEBD4,
            tituloEBD4,
        });

        await newLiturgia.save();

        res.status(201).json({ status: "Liturgia registrada", });
    } catch (error) {
        res.status(500).json({ Erro: "Liturgia não registrada", error });
    }
};

module.exports = { liturgia_New };
