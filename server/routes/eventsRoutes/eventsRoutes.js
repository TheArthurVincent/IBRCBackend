const { loggedInADM, loggedIn } = require("../../controller/studentsController/loggedInAuth/loggedInAuth");
const eventsRoutes = [
  {
    method: "get",
    path: "/eventsgeneral/:id",
    middlewares: [loggedIn],
    // handler: events_seeAll,
  },
  {
    method: "get",
    path: "/eventseenextttoring/:id",
    middlewares: [loggedIn],
    // handler: events_seeNext,
  },
  {
    method: "post",
    path: "/event",
    middlewares: [loggedInADM],
    // handler: event_New,
  },
  {
    method: "post",
    path: "/tutoringevent",
    middlewares: [loggedInADM],
    // handler: event_NewTutoring,
  },
  {
    method: "delete",
    path: "/tutoringevent",
    middlewares: [loggedInADM],
    // handler: event_DeleteTutoring,
  },
  {
    method: "put",
    path: "/event/:id",
    middlewares: [loggedInADM],
    // handler: events_editOne,
  },
  {
    method: "put",
    path: "/eventstatus/:id",
    middlewares: [loggedInADM],
    // handler: events_editOneStatus,
  },
  {
    method: "delete",
    path: "/event/:id",
    middlewares: [loggedInADM],
    // handler: events_deleteOne,
  },
  {
    method: "post",
    path: "/eventreminder/:id",
    middlewares: [loggedInADM],
    // handler: event_reminderEvent,
  },
  {
    method: "get",
    path: "/event/:id",
    middlewares: [loggedInADM],
    // handler: events_seeOne,
  },
  {
    method: "get",
    path: "/tutoringsevents/:studentId",
    middlewares: [loggedInADM],
    // handler: events_seeAllTutoringsFromOneStudent,
  },
  {
    method: "put",
    path: "/tutoringevent",
    middlewares: [loggedIn, loggedInADM],
    // handler: events_editOneTutoring,
  },
];





module.exports = { eventsRoutes };
