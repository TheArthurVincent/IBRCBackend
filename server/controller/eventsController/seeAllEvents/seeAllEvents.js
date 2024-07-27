const { Events_Model } = require("../../../models/Events");
const { Student_Model } = require("../../../models/Students");

/**
 * Handler function to fetch and filter events for a given student.
 *
 * @param {Object} req - The request object containing parameters and query strings.
 * @param {Object} res - The response object used to send the result back to the client.
 *
 * @returns {void} - Sends a JSON response with the filtered events or an error message.
 */
const events_seeAllEvents = async (req, res) => {
    // Extract student ID from URL parameters and 'today' query string.
    const { id } = req.params;
    const { today } = req.query;

    // Parse the 'today' query string into a Date object.
    const hoje = new Date(today);

    // Define the time window for filtering events.
    // Set the limit to 11 days from the 'today' date.
    const limit = new Date(hoje);
    limit.setDate(limit.getDate() + 11);

    // Set 'yesterday' to 3 days before the 'today' date.
    const yesterday = new Date(hoje);
    yesterday.setDate(yesterday.getDate() - 3);

    /**
     * Filters the list of events to include only those within the specified date range.
     *
     * @param {Array} eventsList - The list of events to be filtered.
     * @returns {Array} - The filtered list of events.
     */
    const filtrarEventos = (eventsList) => {
        // Filter events based on the date range.
        const eventosFiltrados = eventsList.filter(function (evento) {
            const dataEvento = new Date(evento.date);
            return dataEvento >= yesterday && dataEvento <= limit;
        });
        return eventosFiltrados;
    };

    try {
        // Fetch the student by ID from the database.
        const student = await Student_Model.findById(id);

        // If the student is not found, respond with a 404 error.
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        let events;
        if (student.permissions === "superadmin") {
            // If the student is a superadmin, fetch all events.
            events = await Events_Model.find();
        } else {
            // If the student is not a superadmin, fetch events based on categories and student ID.
            events = await Events_Model.find({
                $or: [
                    { category: "Group Class" },
                    {
                        $and: [
                            { studentID: id },
                            { category: { $in: ["Tutoring", "Rep", "Prize Class"] } },
                        ],
                    },
                ],
            });
        }

        // Convert the 'date' field of each event to a Date object.
        const eventsList = events.map((event) => {
            const dateObject = new Date(event.date);
            event.date = dateObject;
            return event;
        });

        // Filter the events based on the date range.
        const eventsFiltered = filtrarEventos(eventsList);

        // Respond with the filtered list of events.
        return res.status(200).json({ eventsList: eventsFiltered });
    } catch (error) {
        // Log the error and respond with a 500 Internal Server Error status.
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { events_seeAllEvents };
