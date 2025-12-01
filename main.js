const jsonServer = require("json-server");
const customRouter = require("./router");
const express = require("express");
const checkAuth = require("./middleware/checkAuth");
require("dotenv").config();
const cors = require("cors");

const app = jsonServer.create();
const router = jsonServer.router("./database/db.json");

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://facehook-mocha.vercel.app"],
    credentials: true,
  })
);

// Needed for Renderer/Railway
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Static Files
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

// Bind DB
app.db = router.db;

app.use(express.json());

// Auth Middleware
app.use(checkAuth);

// Custom Routes
app.use("/", customRouter);

// Default JSON Server routes
app.use(router);

// Error handler
app.use((err, req, res, _next) => {
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});

module.exports = app;
