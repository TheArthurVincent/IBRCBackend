const editName = async (student, name) => {
    if (!name) return
    if (student.name !== name) {
        student.name = name;
        return `Nome alterado para ${name}`;
    }
    return null;
};

module.exports = editName;
