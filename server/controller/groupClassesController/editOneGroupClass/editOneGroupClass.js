const { GroupClass_Model } = require("../../../models/GroupClass");

/**
 * Edits a group class identified by its ID.
 * 
 * @param {Object} req - The request object containing parameters and body data.
 * @param {Object} res - The response object to send back the result.
 * @returns {Object} JSON response indicating success or failure.
 */
const groupClasses_edit1Class = async (req, res) => {
  const { id } = req.params;
  const {
    classTitle,
    description,
    videoUrl,
    moduleTitle,
    courseTitle,
    googleDriveLink,
  } = req.body;
  try {
    // Find the class by ID
    const classToEdit = await GroupClass_Model.findById(id);
    if (!classToEdit) {
      // If class is not found, return error
      return res.status(400).json({ message: "Aula não existe" });
    } else if (!classTitle) {
      // If class title is missing, return error
      return res.status(400).json({ message: "Título faltando" });
    } else {
      // Update class properties with new data
      classToEdit.classTitle = classTitle;
      classToEdit.description = description;
      classToEdit.videoUrl = videoUrl;
      classToEdit.moduleTitle = moduleTitle;
      classToEdit.courseTitle = courseTitle;
      classToEdit.googleDriveLink = googleDriveLink;

      // Save the updated class
      await classToEdit.save();

      // Return success message and updated class object
      res.status(201).json({
        status: "Aula atualizada",
        classToEdit,
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(400).json({
      status: "Aula não editada",
    });
  }
};

module.exports = { groupClasses_edit1Class };
