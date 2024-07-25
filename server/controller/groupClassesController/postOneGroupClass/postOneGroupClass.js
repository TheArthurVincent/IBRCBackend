const { createBlogPost } = require("./microservices/blogService");
const { createGroupClass } = require("./microservices/groupClassService");
const { createHomework } = require("./microservices/homeworkService");

/**
 * Creates and posts a new group class, along with associated homework and blog post.
 *
 * @param {Object} req - The request object containing body data.
 * @param {Object} res - The response object to send back the result.
 * @returns {void}
 */
async function groupClasses_post1Class(req, res) {
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
    // Create a new group class
    const newClass = await createGroupClass({
      classTitle,
      description,
      videoUrl,
      moduleTitle,
      courseTitle,
      partner,
      googleDriveLink,
    });

    // Calculate due date and assignment date for the new homework
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 7);

    // Create new homework associated with the group class
    const newHomework = await createHomework({
      description,
      videoUrl,
      googleDriveLink,
      dueDate,
      assignmentDate: today,
    });

    // Create new blog post associated with the group class
    const newBlogPost = await createBlogPost({
      classTitle,
      description,
      videoUrl,
    });

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
}

module.exports = { groupClasses_post1Class };
