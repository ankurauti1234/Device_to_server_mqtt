// src/config/mqttconnection.js
const mqtt = require("mqtt");
const fs = require("fs");
const path = require("path");

const host = process.env.AWS_IOT_ENDPOINT;
const port = 8883;
const clientId = "test_subscriber";
const topic = "sensor/data";

const rootCAPath = path.join(__dirname, "../certificates/root-CA.crt");
const certificatePath = path.join(
  __dirname,
  "../certificates/test.cert.pem.crt"
);
const privateKeyPath = path.join(
  __dirname,
  "../certificates/test.private.pem.key"
);

const options = {
  clientId: clientId,
  protocol: "mqtts",
  port: port,
  host: host,
  ca: [fs.readFileSync(rootCAPath)],
  cert: fs.readFileSync(certificatePath),
  key: fs.readFileSync(privateKeyPath),
  rejectUnauthorized: false,
};

const client = mqtt.connect(options);

client.on("connect", () => {
  console.log("Connected to AWS IoT");
  client.subscribe(topic, { qos: 1 }, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topic}`);
    } else {
      console.error(`Subscription error: ${err}`);
    }
  });
  client.subscribe(topic + "/msgpack", { qos: 1 }, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topic}/msgpack`);
    } else {
      console.error(`Subscription error: ${err}`);
    }
  });
});

module.exports = client;
