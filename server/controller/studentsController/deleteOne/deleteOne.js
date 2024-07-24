const { Student_Model } = require("../../../models/Students"); // Importing the Student_Model from the models directory

/**
 * Controller function to delete a student by ID.
 * @param {Object} req - Express request object containing student ID in req.params.
 * @param {Object} res - Express response object to send HTTP response.
 * @returns {Object} JSON response indicating success or failure of student deletion.
 */
const student_deleteOne = async (req, res) => {
    try {
        const { id } = req.params; // Extracting student ID from request parameters
        const student = await Student_Model.findById(id); // Finding student by ID

        // If student is not found, return 404 Not Found
        if (!student) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        } else {
            await student.deleteOne(); // Deleting the student from the database
            res.status(200).json({
                status: "Aluno excluído com sucesso",
            });
        }
    } catch (error) {
        // If any error occurs during deletion, return 500 Internal Server Error
        res.status(500).json({ erro: "Falha ao excluir aluno!", status: error });
    }
};

module.exports = { student_deleteOne }; // Exporting the controller function
