const editUsername = async (student, username) => {
    if (!username) return
    if (student.username !== username) {
        student.username = username;
        return `Nome de usuário alterado para ${username}`;
    }
    return null;
};

module.exports = editUsername