/**
 * Delete a tutoring session by its ID.
 * @param {object} req - Express request object containing parameters.
 * @param {object} res - Express response object for sending responses.
 * @returns {object} JSON response confirming deletion status.
 */
const { Tutoring_Model } = require("../../../models/Tutoring");

const tutoring_deleteOne = async (req, res) => {
  const { id } = req.params;

  try {
    // Attempt to find and delete the tutoring session by ID
    const deletedTutoring = await Tutoring_Model.findByIdAndDelete(id);

    // If tutoring session is not found, return a 404 error
    if (!deletedTutoring) {
      res.status(404).json({ Erro: "Aula não encontrada" });
      return;
    }

    // Respond with success message if deletion was successful
    res.status(200).json({ status: "Aula excluída com sucesso" });
  } catch (error) {
    // Handle any errors that occur during deletion
    console.error(error);
    res.status(500).json({ Erro: "Erro ao excluir aula" });
  }
};

module.exports = { tutoring_deleteOne };
