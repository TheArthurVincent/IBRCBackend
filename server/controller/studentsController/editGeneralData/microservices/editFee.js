const editFee = async (student, fee) => {
    if (!fee) return
    const numberFee = parseInt(fee);
    if (student.fee !== numberFee) {
        student.fee = numberFee;
        return `Taxa alterada para ${numberFee}`;
    }
    return null;
};

module.exports = editFee