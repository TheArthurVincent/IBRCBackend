const { Student_Model } = require("../../../models/Students");

/**
 * Edita as permissões de um aluno especificado pelo ID.
 *
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 * @returns {Promise<void>}
 */
const student_editPermissions = async (req, res) => {
  const { permissions } = req.body; // Extrai as permissões do corpo da requisição
  try {
    const { id } = req.params; // Obtém o ID do aluno a partir dos parâmetros da requisição
    const studentWhosePermissionsToEdit = await Student_Model.findById(id); // Busca o aluno pelo ID no banco de dados

    // Verifica se o aluno foi encontrado
    if (!studentWhosePermissionsToEdit) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    } else if (!permissions) {
      // Verifica se as permissões estão presentes no corpo da requisição
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    } else if (studentWhosePermissionsToEdit.permissions === permissions) {
      // Verifica se as permissões são idênticas às já existentes no aluno
      res.json({
        message: `Nenhuma edição de permissões feita no usuário ${studentWhosePermissionsToEdit.username}`,
      });
    } else {
      // Caso haja alterações nas permissões, atualiza e salva no banco de dados
      studentWhosePermissionsToEdit.permissions = permissions;
      await studentWhosePermissionsToEdit.save();

      // Responde com sucesso e retorna o aluno atualizado
      res.status(200).json({
        message: "Permissões do aluno editadas com sucesso",
        updatedUser: studentWhosePermissionsToEdit,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao editar permissões do aluno");
  }
};

module.exports = { student_editPermissions };
