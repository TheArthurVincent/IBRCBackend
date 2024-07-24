const editLastname = async (student, lastname) => {
    if (!lastname) return
    if (student.lastname !== lastname) {
        student.lastname = lastname;
        return `Sobrenome alterado para ${lastname}`;
    }
    return null;
};

module.exports = editLastname