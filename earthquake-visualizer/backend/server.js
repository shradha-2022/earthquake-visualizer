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

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
});
