const { GroupClass_Model } = require("../../../models/GroupClass");

/**
 * Retrieves details of a specific group class based on its ID.
 *
 * @param {Object} req - The request object containing parameters.
 * @param {Object} res - The response object to send back the retrieved class details.
 * @returns {Object} JSON response containing the details of the group class.
 */
const groupClasses_get1Class = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the group class by its ID
    const classDetails = await GroupClass_Model.findById(id);

    // If no class is found with the given ID, return a 404 error
    if (!classDetails) {
      return res.status(404).json({ error: "Aula não encontrada" });
    }

    // Return the class details
    res.json(classDetails);
  } catch (error) {
    // Handle any errors that occur during the retrieval process
    console.error("Erro ao obter os detalhes da aula:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = { groupClasses_get1Class };
