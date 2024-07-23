const { CourseInfo_Model } = require("../../../../models/CourseClass");

/**
 * Adds a student to a specified course by updating the course's student list.
 *
 * @param {string} studentId - The ID of the student to add
 * @param {string} courseId - The ID of the course to add the student to
 * @returns {Promise<void>} - Promise representing the asynchronous operation
 */
const addStudentToCourse = async (studentId, courseId) => {
  // Find the course by its ID
  const course = await CourseInfo_Model.findById(courseId);

  // If the course is found, add the student to its list of students
  if (course) {
    course.studentsWhoHaveAccessToIt.push(studentId);
    await course.save();
  }
};

module.exports = { addStudentToCourse };
