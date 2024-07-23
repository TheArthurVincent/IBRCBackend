const { HistoryRanking_Model } = require("../../../../models/HistoryRanking");

const student_getAllRankingItems = async (req, res) => {
    try {
        const scoreMonth = await HistoryRanking_Model.find();
        res.status(200).json({ scoreMonth: scoreMonth.reverse(), message: "Sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error, e: "Ocorreu um erro " });
    }
};

module.exports = { student_getAllRankingItems }