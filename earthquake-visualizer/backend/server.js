// backend/server.js
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ Earthquake Backend is running!");
});

// Example API route
app.get("/api/earthquakes", (req, res) => {
  res.json([
    { id: 1, location: "Japan", magnitude: 6.8 },
    { id: 2, location: "Chile", magnitude: 7.1 },
  ]);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
