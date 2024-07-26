const { events_seeAllTutoringsFrom1Student } = require("../../controller/eventsController/allTutoringsFrom1Student/allTutoringsFrom1Student");
const { events_delete1Event } = require("../../controller/eventsController/deleteOneEvent/deleteOneEvent");
const { event_Delete1SequenceOfTutorings } = require("../../controller/eventsController/deleteOneTutoring/deleteOneTutoring");
const { events_edit1Event } = require("../../controller/eventsController/editOneEvent/editOneEvent");
const { events_edit1Status } = require("../../controller/eventsController/editOneStatus/editOneStatus");
const { events_see1Event } = require("../../controller/eventsController/getOneEvent/getOneEvent");
const { event_NewEvent } = require("../../controller/eventsController/newEvent/newEvent");
const { event_NewTutoring } = require("../../controller/eventsController/newTutoring/newTutoring");
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
  {
    method: "delete",
    path: "/tutoringevent",
    middlewares: [loggedIn, loggedInADM],
    handler: event_Delete1SequenceOfTutorings,
  },
  {
    method: "put",
    path: "/eventstatus/:id",
    middlewares: [loggedIn, loggedInADM],
    handler: events_edit1Status,
  },
  {
    method: "get",
    path: "/tutoringsevents/:studentId",
    middlewares: [loggedIn, loggedInADM],
    handler: events_seeAllTutoringsFrom1Student,
  },
  {
    method: "post",
    path: "/tutoringevent",
    middlewares: [loggedIn, loggedInADM],
    handler: event_NewTutoring,
  },
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
  //   method: "put",
  //   path: "/tutoringevent",
  //   middlewares: [loggedIn, loggedInADM],
  // handler: events_editOneTutoring,
  // },
];

module.exports = { eventsRoutes };
