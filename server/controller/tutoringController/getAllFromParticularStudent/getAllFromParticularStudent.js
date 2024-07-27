const { Student_Model } = require("../../../models/Students");
const { Tutoring_Model } = require("../../../models/Tutoring");

const tutoring_getAllFromParticularStudent = async (req, res) => {
    const { studentID } = req.params;
    try {
        const tutoring = await Tutoring_Model.find({ studentID });
        const studentTheClassBelongsTo = await Student_Model.findOne({
            _id: studentID,
        });

        const formattedTutoringFromParticularStudent = tutoring.map(
            (tutoring, index) => {
                return {
                    position: index,
                    id: tutoring._id,
                    title: tutoring.title,
                    date: tutoring.date,
                    videoUrl: tutoring.videoUrl,
                    attachments: tutoring.attachments,
                    createdAt: tutoring.createdAt,
                    updatedAt: tutoring.updatedAt,
                    belongsTo: {
                        name:
                            studentTheClassBelongsTo.name +
                            " " +
                            studentTheClassBelongsTo.lastname,
                        username: studentTheClassBelongsTo.username,
                    },
                };
            }
        );

        formattedTutoringFromParticularStudent.sort((a, b) => {
            const dateA = new Date(a.date.split("/").reverse().join("-"));
            const dateB = new Date(b.date.split("/").reverse().join("-"));
            return dateA - dateB;
        });

        formattedTutoringFromParticularStudent.reverse();

        res.status(201).json({
            status: "Aulas encontradas",
            formattedTutoringFromParticularStudent,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ Erro: "Este aluno não tem aulas registradas" });
    }
};

module.exports = { tutoring_getAllFromParticularStudent };
