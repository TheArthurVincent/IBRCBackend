const editPicture = async (student, picture) => {
    if (!picture) return
    if (student.picture !== picture) {
        student.picture = picture;
        return `Foto alterada`;
    }
    return null;
};

module.exports = editPicture