// src/routes/device.js
const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/deviceController");

// Route to search devices by device_id
router.get("/search", sensorController.searchDevices);
// Route to get all devices data
router.get("/", sensorController.getJsonData);
// Route to search business data by device_id
router.get("/business-data/search", sensorController.searchBusinessData);

// Route to get all devices business data
router.get("/business-data", sensorController.getMsgpackData);

// Route to get latest entry of device data
router.get("/latest", sensorController.getLatestEntryByDeviceId);





// Route to update a device record
router.put("/:id", sensorController.updateDevice);

// Route to delete a device record
router.delete("/:id", sensorController.deleteDevice);

module.exports = router;
