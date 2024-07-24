/**
 * Deletes a tutoring session if its associated student doesn't exist.
 * @param {string} tutoringID - The ID of the tutoring session to delete.
 */
async function deleteTutoringIfStudentsDoesnTExist(tutoringID) {
  try {
    // Attempt to find and delete the tutoring session by its ID
    await Tutoring_Model.findByIdAndDelete(tutoringID);
    console.log(`Aula com ID ${tutoringID} excluída`); // Log success message if deletion is successful
  } catch (error) {
    console.log(`Erro ao excluir aula com ID ${tutoringID}: ${error}`); // Log error message if deletion fails
  }
}

module.exports = { deleteTutoringIfStudentsDoesnTExist }; // Export the function for use in other modules
