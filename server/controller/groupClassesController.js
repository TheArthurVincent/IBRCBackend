const { GroupClass_Model } = require("../models/GroupClass");
const { Homework_Model } = require("../models/Homework");
const { Blog_Model } = require("../models/Posts");

const groupClasses_getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const classDetails = await GroupClass_Model.findById(id);

    if (!classDetails) {
      return res.status(404).json({ error: "Aula não encontrada" });
    }

    res.json(classDetails);
  } catch (error) {
    console.error("Erro ao obter os detalhes da aula:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const groupClasses_postOneClass = async (req, res) => {
  const {
    classTitle,
    description,
    videoUrl,
    moduleTitle,
    courseTitle,
    partner,
    googleDriveLink,
  } = req.body;
  try {
    const newClass = new GroupClass_Model({
      classTitle,
      description,
      videoUrl,
      moduleTitle,
      courseTitle,
      partner,
      googleDriveLink,
      createrAt: new Date(),
    });


    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    function addOneDay(dateString) {
      let date = new Date(dateString);

      date.setDate(date.getDate() + 1);

      let newDateString = date.toISOString().split('T')[0];

      return newDateString;
    }



    const newHomework = new Homework_Model({
      description,
      videoUrl,
      googleDriveLink,
      category: "groupclass",
      dueDate: addOneDay(dueDate),
      assignmentDate: addOneDay(today),
    });
    const newBlogPost = new Blog_Model({
      title: `Group Class: ${classTitle}`,
      videoUrl,
      text: `Última aula em grupo ao vivo: ${description}`,
    });

    await newBlogPost.save();
    await newHomework.save();
    await newClass.save();
    res.status(201).json({
      NewClass: newClass,
    });
  } catch (error) {
    res.status(400).json({
      status: "Aula não postada",
    });
  }
};

const groupClasses_getAllObjects = async (req, res) => {
  try {
    const classes = await GroupClass_Model.find().sort({ createdAt: -1 });
    res.json(classes.reverse());
  } catch (error) {
    console.error("Erro ao listar cursos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  groupClasses_getAllObjects,
  groupClasses_getOne,
  groupClasses_postOneClass,
};
