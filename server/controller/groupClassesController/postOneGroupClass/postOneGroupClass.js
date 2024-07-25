const { GroupClass_Model } = require("../../../models/GroupClass");
const { Homework_Model } = require("../../../models/Homework");
const { Blog_Model } = require("../../../models/Posts");

/**
 * Creates and posts a new group class, along with associated homework and blog post.
 *
 * @param {Object} req - The request object containing body data.
 * @param {Object} res - The response object to send back the result.
 * @returns {Object} JSON response indicating success or failure.
 */
const groupClasses_post1Class = async (req, res) => {
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
    // Create a new GroupClass instance
    const newClass = new GroupClass_Model({
      classTitle,
      description,
      videoUrl,
      moduleTitle,
      courseTitle,
      partner,
      googleDriveLink,
      createdAt: new Date(), // Use current date as creation timestamp
    });

    // Calculate due date and assignment date for the new homework
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 7); // Set due date 7 days from today

    // Function to add one day to a given date string
    function addOneDay(dateString) {
      let date = new Date(dateString);
      date.setDate(date.getDate() + 1);
      return date.toISOString().split("T")[0];
    }

    // Create a new Homework instance
    const newHomework = new Homework_Model({
      description,
      videoUrl,
      googleDriveLink,
      category: "groupclass",
      dueDate: addOneDay(dueDate), // Set due date for homework
      assignmentDate: addOneDay(today), // Set assignment date for homework
    });

    // Create a new Blog post instance
    const newBlogPost = new Blog_Model({
      title: `Group Class: ${classTitle}`,
      videoUrl,
      text: `Última aula em grupo ao vivo: ${description}`, // Example text for blog post
    });

    // Save all new instances to the database
    await newBlogPost.save();
    await newHomework.save();
    await newClass.save();

    // Return success message and the new class object
    res.status(201).json({
      NewClass: newClass,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(400).json({
      status: "Aula não postada",
    });
  }
};

module.exports = { groupClasses_post1Class };
