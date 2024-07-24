// Import necessary models
const { HistoryRanking_Model } = require("../../../../models/HistoryRanking");

/**
 * Controller function to retrieve all ranking items from the HistoryRanking model.
 * Retrieves all documents from the HistoryRanking collection and sends them in reverse order.
 *
 * @param {Object} req - Express request object (unused in this function)
 * @param {Object} res - Express response object for sending JSON response
 */
const student_getAllRankingItems = async (req, res) => {
  try {
    // Retrieve all documents from HistoryRanking collection
    const scoreMonth = await HistoryRanking_Model.find();

    // Send success response with ranking items in reverse order
    res
      .status(200)
      .json({ scoreMonth: scoreMonth.reverse(), message: "Sucesso" });
  } catch (error) {
    // Handle errors during data retrieval
    console.error(error);
    res.status(500).json({ error: error, e: "Ocorreu um erro" });
  }
};

// Export the controller function for use in routes
module.exports = { student_getAllRankingItems };
