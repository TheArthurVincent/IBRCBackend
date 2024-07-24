const editPhoneNumber = async (student, phoneNumber) => {
    if (!phoneNumber) return
    if (student.phoneNumber !== phoneNumber) {
        student.phoneNumber = phoneNumber;
        return `Número de telefone alterado para ${phoneNumber}`;
    }
    return null;
};

module.exports = editPhoneNumber


