const editAddress = async (student, address) => {
    if (!address) return
    if (student.address !== address) {
        student.address = address;
        return `Endereço alterado para ${address}`;
    }
    return null;
};

module.exports = editAddress