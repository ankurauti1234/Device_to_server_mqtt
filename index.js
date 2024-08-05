require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import CORS
const connectDB = require("./src/config/mongoDB");
const sensorRoutes = require("./src/routes/device");
const pool = require("./src/config/postgresDB");

const app = express();

// Configure CORS
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests only from this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow specific HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Test PostgreSQL connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err);
  } else {
    console.log("PostgreSQL connected:", res.rows[0].now);
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions)); // Enable CORS with the specified options
app.use(express.json());

// Routes
app.use("/api/device", sensorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
