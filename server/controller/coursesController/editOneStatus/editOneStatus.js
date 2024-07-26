const { Events_Model } = require("../../../models/Events");

const events_edit1Status = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const editedEvent = await Events_Model.findById(id);
    try {
        if (!status) {
            res.status(500).json({ info: "informações faltantes" });
        } else {
            if (!editedEvent) {
                return res.status(500).json("Evento não encontado");
            } else {
                editedEvent.status = status;
                editedEvent.edited = true;
                editedEvent.save();
                res.status(200).json({ message: "Success!", editedEvent });
            }
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { events_edit1Status }