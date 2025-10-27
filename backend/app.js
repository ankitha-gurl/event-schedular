const express = require("express");
const cors = require("cors");
const eventRoutes = require("./routes/events");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🎉 Event Management API is Running");
});

app.use("/api/events", eventRoutes);

module.exports = app;
