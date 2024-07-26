const { events_delete1Event } = require("../../controller/eventsController/deleteOneEvent/deleteOneEvent");
const { events_edit1Event } = require("../../controller/eventsController/editOneEvent/editOneEvent");
const { events_see1Event } = require("../../controller/eventsController/getOneEvent/getOneEvent");
const { event_NewEvent } = require("../../controller/eventsController/newEvent/newEvent");
const { events_seeAllEvents } = require("../../controller/eventsController/seeAllEvents/seeAllEvents");
const { loggedInADM, loggedIn } = require("../../controller/studentsController/loggedInAuth/loggedInAuth");

const eventsRoutes = [
  {
    method: "put",
    path: "/event/:id",
    middlewares: [loggedIn, loggedInADM],
    handler: events_edit1Event,
  },
  {
    method: "get",
    path: "/event/:id",
    middlewares: [loggedIn],
    handler: events_see1Event,
  },
  {
    method: "post",
    path: "/event",
    middlewares: [loggedIn, loggedInADM],
    handler: event_NewEvent,
  },
  {
    method: "get",
    path: "/eventsgeneral/:id",
    middlewares: [loggedIn],
    handler: events_seeAllEvents,
  },
  {
    method: "delete",
    path: "/event/:id",
    middlewares: [loggedIn, loggedInADM],
    handler: events_delete1Event,
  },
  // {
  //   method: "post",
  //   path: "/tutoringevent",
  //   middlewares: [loggedInADM],
  // handler: event_NewTutoring,
  // },
  // {
  //   method: "delete",
  //   path: "/tutoringevent",
  //   middlewares: [loggedInADM],
  // handler: event_DeleteTutoring,
  // },
  // {
  //   method: "put",
  //   path: "/eventstatus/:id",
  //   middlewares: [loggedInADM],
  // handler: events_editOneStatus,
  // },
  // {
  //   method: "post",
  //   path: "/eventreminder/:id",
  //   middlewares: [loggedInADM],
  // handler: event_reminderEvent,
  // },
  // {
  //   method: "get",
  //   path: "/event/:id",
  //   middlewares: [loggedInADM],
  // handler: events_seeOne,
  // },
  // {
  //   method: "get",
  //   path: "/tutoringsevents/:studentId",
  //   middlewares: [loggedInADM],
  // handler: events_seeAllTutoringsFromOneStudent,
  // },
  // {
  //   method: "put",
  //   path: "/tutoringevent",
  //   middlewares: [loggedIn, loggedInADM],
  // handler: events_editOneTutoring,
  // },
];

module.exports = { eventsRoutes };
