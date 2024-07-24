const editGoogleDriveLink = async (student, googleDriveLink) => {
    if (!googleDriveLink) return
    if (student.googleDriveLink !== googleDriveLink) {
        student.googleDriveLink = googleDriveLink;
        return `Link do Google Drive alterado para ${googleDriveLink}`;
    }
    return null;
};

module.exports = editGoogleDriveLink