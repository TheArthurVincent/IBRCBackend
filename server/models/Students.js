const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    supreme: { type: Boolean, required: false, unique: true, default: false },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validade: [validator.isEmail, "Escolha um e-mail válido"],
    },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    doc: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    ///
    scoreTimeline: {
      type: Array,
      default: [],
      required: false,
    },
    flashcardsDailyReviews: {
      type: Array,
      default: [],
      required: false,
    },
    tutoringDays: {
      type: Array,
      default: [],
      required: false,
    },
    flashCards: {
      type: Array,
      default: [],
      required: false,
    },
    totalScore: { type: Number, required: true, default: 0 },
    monthlyScore: { type: Number, required: true, default: 0 },
    weeklyClasses: { type: Number, required: true, default: 1 },
    ///
    dateOfBirth: { type: String, required: true },
    permissions: { type: String, required: false, default: "student" },
    ankiEmail: { type: String, required: false },
    ankiPassword: { type: String, required: false },
    fee: { type: Number, required: false, default: 300 },
    googleDriveLink: {
      type: String,
      required: false,
      default: "https://portal.arthurvincent.com.br/message",
    },
    address: { type: String, required: false },
    picture: {
      type: String,
      required: false,
      default:
        "https://ik.imagekit.io/vjz75qw96/assets/arvin_visuals/profile.jpg?updatedAt=1705408334723",
    },
    language: { type: String, required: false, default: "pt" },
    changedPasswordBeforeLogInAgain: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Student_Model = mongoose.model("Student", studentSchema);

module.exports = {
  Student_Model,
};
