// src/controllers/deviceController.js
const DeviceData = require("../models/deviceData");
const PostgresSensorData = require("../models/bussinessData");
const mqttClient = require("../config/mqttconnection");
const msgpack = require("msgpack5")();

exports.getJsonData = async (req, res) => {
  try {
    const data = await DeviceData.find().sort({ timestamp: -1 }).limit(10);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchDevices = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "id query parameter is required" });
  }

  try {
    // Perform an exact match search
    const data = await DeviceData.find({ device_id: id })
      .sort({ timestamp: -1 })
      .limit(10);

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No devices found with the given id" });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// src/controllers/deviceController.js
exports.searchBusinessData = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "id query parameter is required" });
  }

  try {
    const data = await PostgresSensorData.searchByDeviceId(id);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Fetch the latest entry by device_id
exports.getLatestEntryByDeviceId = async (req, res) => {
  const { device_id } = req.query;

  if (!device_id) {
    return res
      .status(400)
      .json({ message: "device_id query parameter is required" });
  }

  try {
    const latestEntry = await DeviceData.findOne({ device_id }).sort({
      timestamp: -1,
    }); // Sort by timestamp in descending order
    if (!latestEntry) {
      return res
        .status(404)
        .json({ message: "No data found for the given device_id" });
    }
    res.status(200).json(latestEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a device record
exports.updateDevice = async (req, res) => {
  const { id } = req.params;
  const { device_id, timestamp, temperature, humidity } = req.body;
  try {
    const updatedData = await DeviceData.findByIdAndUpdate(
      id,
      { device_id, timestamp, temperature, humidity },
      { new: true }
    );
    res.status(200).json(updatedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a device record
exports.deleteDevice = async (req, res) => {
  const { id } = req.params;
  try {
    await DeviceData.findByIdAndDelete(id);
    res.status(200).json({ message: "Device data deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMsgpackData = async (req, res) => {
  try {
    const data = await PostgresSensorData.getLatest();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to handle incoming MQTT messages
const handleMqttMessage = async (topic, message) => {
  try {
    if (topic.endsWith("/data")) {
      const data = JSON.parse(message.toString());
      const sensorData = new DeviceData(data);
      await sensorData.save();
      //   console.log("JSON data saved to MongoDB:", sensorData);
      console.log("JSON data saved to MongoDB:");
    } else if (topic.endsWith("/msgpack")) {
      const data = msgpack.decode(message);
      //   console.log("Decoded MessagePack data:", data);
      console.log("Decoded MessagePack data:");
      try {
        const result = await PostgresSensorData.insert(data);
        // console.log("MessagePack data saved to PostgreSQL:", result);
        console.log("MessagePack data saved to PostgreSQL:");
      } catch (pgError) {
        console.error("Error saving to PostgreSQL:", pgError);
      }
    }
  } catch (error) {
    console.error("Error handling MQTT message:", error);
  }
};

// Subscribe to MQTT messages
mqttClient.on("message", handleMqttMessage);
