const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// GET / - welcome message
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Addepalli Tejosai's Lab 1 Node.js and Express server!");
});

// GET /about - student details as JSON
app.get("/about", (req, res) => {
  res.status(200).json({
    name: "Addepalli Tejosai",
    registrationNumber: "252U1R9002",
    section: "CSE_GAI-304"
  });
});

// GET /time - current server date and time
app.get("/time", (req, res) => {
  res.status(200).json({
    currentDateTime: new Date().toString()
  });
});

// 404 handler for unknown paths
app.use((req, res) => {
  res.status(404).json({
    error: "404 - Route not found",
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});
