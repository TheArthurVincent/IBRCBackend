const { Student_Model } = require("../../../../models/Students"); // Importing the Student_Model from the models directory
const bcrypt = require("bcrypt"); // Importing bcrypt for password hashing

/**
 * Controller function to handle editing a student's password by admin.
 * @param {Object} req - Express request object containing new password in req.body and student ID in req.params.
 * @param {Object} res - Express response object to send HTTP response.
 * @returns {Object} JSON response indicating success or failure of password update.
 */
const student_editPasswordAdm = async (req, res) => {
  const { newPassword } = req.body; // Extracting new password from request body
  const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hashing the new password

  try {
    const { id } = req.params; // Extracting student ID from request parameters
    const studentWhosePasswordYouWantToChange = await Student_Model.findById(
      id
    ); // Finding student by ID

    // If student is not found, return 404 Not Found
    if (!studentWhosePasswordYouWantToChange) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    } else if (!hashedPassword) {
      // If hashed password is falsy (which shouldn't happen), return bad request
      return res.status(400).json({ message: "Escolha uma nova senha" });
    } else if (
      studentWhosePasswordYouWantToChange.password === hashedPassword
    ) {
      // If new hashed password matches current password, prompt for a different password
      res.json({
        message: `Escolha uma senha diferente para ${studentWhosePasswordYouWantToChange.username}`,
      });
    } else {
      // Update student's password and save to database
      studentWhosePasswordYouWantToChange.password = hashedPassword;
      await studentWhosePasswordYouWantToChange.save();

      // Send success response with updated student object
      res.status(200).json({
        message: "Senha editada com sucesso",
        updatedUser: studentWhosePasswordYouWantToChange,
      });
      console.error(studentWhosePasswordYouWantToChange); // Logging the updated student object
    }
  } catch (error) {
    console.error(error); // Logging any errors that occur
    res.status(500).send("Erro ao editar aluno"); // Send internal server error if an exception is caught
  }
};

module.exports = { student_editPasswordAdm }; // Exporting the controller function
