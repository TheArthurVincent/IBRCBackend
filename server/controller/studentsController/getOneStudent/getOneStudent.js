const { Student_Model } = require("../../../models/Students");

const students_getOne = async (req, res) => {
    try {
        const student = await Student_Model.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        const formattedStudentData = {
            id: student._id,
            username: student.username,
            email: student.email,
            name: student.name,
            lastname: student.lastname,
            fullname: student.name + " " + student.lastname,
            permissions: student.permissions,
            doc: student.doc,
            address: student.address,
            phoneNumber: student.phoneNumber,
            picture: student.picture,
            dateOfBirth: student.dateOfBirth,
            weeklyClasses: student.weeklyClasses,
            monthlyScore: student.monthlyScore,
            googleDriveLink: student.googleDriveLink,
            totalScore: student.totalScore,
            fee: student.fee,
        };
        res.status(200).json({
            status: "Aluno encontrado",
            formattedStudentData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Nenhum aluno encontrado!", status: error });
    }
};

module.exports = { students_getOne };
