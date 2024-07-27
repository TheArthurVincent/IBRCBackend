const { GroupClass_Model } = require("../../../models/GroupClass");

/**
 * Retrieves all group classes from the database, sorted by creation date in descending order.
 * 
 * @param {Object} req - The request object (not used directly).
 * @param {Object} res - The response object to send back the retrieved classes.
 * @returns {Object} JSON response containing array of group classes.
 */
const groupClasses_getAllObjects = async (req, res) => {
  try {
    // Find all group classes and sort by createdAt date in descending order
    const classes = await GroupClass_Model.find().sort({ createdAt: -1 });

    // Reverse the array to ensure the most recent classes appear first
    res.json(classes.reverse());
  } catch (error) {
    // Handle any errors that occur during the retrieval process
    console.error("Erro ao listar cursos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = { groupClasses_getAllObjects };
