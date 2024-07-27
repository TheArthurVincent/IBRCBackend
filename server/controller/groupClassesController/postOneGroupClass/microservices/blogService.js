const { Blog_Model } = require("../../../../models/Posts");

/**
 * Creates a new blog post instance and saves it to the database.
 *
 * @param {Object} data - Object containing blog post details.
 * @returns {Promise<Object>} Newly created blog post object.
 * @throws {Error} If there's an issue while saving to the database.
 */
async function createBlogPost(data) {
  try {
    const { classTitle, description, videoUrl } = data;

    const newBlogPost = new Blog_Model({
      title: `Group Class: ${classTitle}`,
      videoUrl,
      text: `Última aula em grupo ao vivo: ${description}`,
    });

    await newBlogPost.save();

    return newBlogPost;
  } catch (error) {
    throw error;
  }
}

module.exports = { createBlogPost };
