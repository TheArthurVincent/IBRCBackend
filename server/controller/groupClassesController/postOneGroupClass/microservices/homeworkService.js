const { Homework_Model } = require("../../../../models/Homework");

/**
 * Adds one day to the given date string.
 *
 * @param {string} dateString - Date string to increment.
 * @returns {string} ISO string of the date incremented by one day.
 */
function addOneDay(dateString) {
    let date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
}

/**
 * Creates a new homework instance and saves it to the database.
 *
 * @param {Object} data - Object containing homework details.
 * @returns {Promise<Object>} Newly created homework object.
 * @throws {Error} If there's an issue while saving to the database.
 */
async function createHomework(data) {
    try {
        const { description, videoUrl, googleDriveLink, dueDate, assignmentDate } =
            data;

        const newHomework = new Homework_Model({
            description,
            videoUrl,
            googleDriveLink,
            category: "groupclass",
            dueDate: addOneDay(dueDate),
            assignmentDate: addOneDay(assignmentDate),
        });

        await newHomework.save();

        return newHomework;
    } catch (error) {
        throw error;
    }
}

module.exports = { createHomework };
