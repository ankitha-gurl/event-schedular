const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: { type: String, enum: ["going", "maybe"], default: "going" }
});

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  endTime: String,
  location: String,
  category: String,
  description: String,
  organizer: String,
  organizerId: Number,
  maxAttendees: Number,
  attendees: [attendeeSchema]
});

module.exports = mongoose.model("Event", eventSchema);
