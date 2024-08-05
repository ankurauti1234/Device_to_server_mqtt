// src/models/deviceData.js
const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema({
  device_id: String,
  timestamp: Number,
  temperature: Number,
  humidity: Number,
});

SensorDataSchema.index({ device_id: "text" }); // Create text index on device_id

module.exports = mongoose.model("SensorData", SensorDataSchema);
