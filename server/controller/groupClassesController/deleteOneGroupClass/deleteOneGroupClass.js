const { GroupClass_Model } = require("../../../models/GroupClass");

/**
 * Deletes a group class by its ID.
 * 
 * @param {Object} req - The request object containing parameters.
 * @param {Object} res - The response object to send back the result.
 * @returns {Object} JSON response indicating success or failure.
 */
const groupClasses_delete1Class = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the class by ID
    const classToDelete = await GroupClass_Model.findById(id);
    if (!classToDelete) {
      // If class is not found, return error
      return res.status(400).json({ message: "Aula não existe" });
    } else {
      // Delete the found class
      await classToDelete.deleteOne();

      // Return success message
      res.status(201).json({
        status: "Aula excluída com sucesso",
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(400).json({
      status: "Aula não excluído",
    });
  }
};

module.exports = { groupClasses_delete1Class };
