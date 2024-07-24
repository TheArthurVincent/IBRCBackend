const { Homework_Model } = require("../../../models/Homework");
const { Student_Model } = require("../../../models/Students");

const homework_getAll = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Student_Model.findById(id);
        if (!student) {
            return res.status(404).json({ error: "Estudante não encontrado" });
        }

        const tutoringHomework = await Homework_Model.find({ studentID: id });
        const groupClassHomework = await Homework_Model.find({ category: "groupclass" });

        const tutoringHomeworkList = tutoringHomework.sort(
            (a, b) => new Date(a.assignmentDate) - new Date(b.assignmentDate)
        );

        const updatedGroupClassHomeworkList = groupClassHomework.map(homework => {
            const isTrue = homework.studentsWhoDidIt.includes(id)
            if (!isTrue) {
                return { ...homework._doc, status: "pending" }; // _doc é usado para acessar os dados do documento do Mongoose
            } else {
                return { ...homework._doc, status: "done" }; // _doc é usado para acessar os dados do documento do Mongoose
            }
        }).sort(
            (a, b) => new Date(a.assignmentDate) - new Date(b.assignmentDate)
        );

        tutoringHomework.reverse();
        groupClassHomework.reverse()

        res.status(200).json({
            tutoringHomeworkList,
            groupClassHomeworkList: updatedGroupClassHomeworkList,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Nenhum homework encontrado" });
    }
};

module.exports = { homework_getAll }