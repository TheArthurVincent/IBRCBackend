const { GroupClass_Model } = require("../../../../models/GroupClass");

/**
 * Creates a new group class instance and saves it to the database.
 *
 * @param {Object} data - Object containing class details.
 * @returns {Promise<Object>} Newly created group class object.
 * @throws {Error} If there's an issue while saving to the database.
 */
async function createGroupClass(data) {
    try {
        const {
            classTitle,
            description,
            videoUrl,
            moduleTitle,
            courseTitle,
            partner,
            googleDriveLink,
        } = data;

        const newClass = new GroupClass_Model({
            classTitle,
            description,
            videoUrl,
            moduleTitle,
            courseTitle,
            partner,
            googleDriveLink,
            createdAt: new Date(),
        });

        await newClass.save();

        return newClass;
    } catch (error) {
        throw error;
    }
}

module.exports = { createGroupClass };
