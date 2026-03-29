/**
 * server.js — Main Express server entry point
 * Handles auth, image uploads, scan management, and admin functionality.
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(uploadsDir));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/scan", require("./routes/scan"));
app.use("/api/admin", require("./routes/admin"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Skin Cancer Detection API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Max size is 10MB." });
    }
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: "Internal server error" });
});

// Create default admin user if it doesn't exist
const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@skincare.com";
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || "admin123",
        role: "admin",
      });
      console.log(`👤 Default admin created: ${adminEmail}`);
    }
  } catch (error) {
    console.error("Failed to create default admin:", error.message);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  await createDefaultAdmin();

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Uploads directory: ${uploadsDir}`);
    console.log(`🔗 API Health: http://localhost:${PORT}/api/health\n`);
  });
};

startServer();
