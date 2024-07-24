const editEmail = async (student, email) => {
    if (!email) return
    if (student.email !== email) {
        student.email = email;
        return `Email alterado para ${email}`;
    }
    return null;
};

module.exports = editEmail