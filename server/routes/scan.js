/**
 * scan.js — Scan routes (upload image, get history, get single scan)
 */
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const auth = require("../middleware/auth");
const Scan = require("../models/Scan");

const router = express.Router();

// Configure multer for image uploads
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  },
});

/**
 * POST /api/scan/upload
 * Upload an image and get AI prediction
 */
router.post("/upload", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const imagePath = req.file.path;
    const modelApiUrl = process.env.MODEL_API_URL || "http://localhost:5000";

    // Send image to Python model API
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    let prediction;
    try {
      const response = await axios.post(`${modelApiUrl}/predict`, formData, {
        headers: { ...formData.getHeaders() },
        maxContentLength: 50 * 1024 * 1024,
        timeout: 60000, // 60 second timeout
      });
      prediction = response.data;
    } catch (apiError) {
      console.error("Model API error:", apiError.message);
      // If model API is down, return a fallback response
      return res.status(503).json({
        message: "AI model service is unavailable. Please ensure the Python model server is running on port 5000.",
      });
    }

    // Save scan result to database
    const scan = new Scan({
      userId: req.user._id,
      imagePath: `/uploads/${req.file.filename}`,
      originalFilename: req.file.originalname,
      prediction: prediction.prediction,
      predictionKey: prediction.prediction_key,
      confidence: prediction.confidence,
      riskLevel: prediction.risk_level,
      heatmapBase64: prediction.heatmap,
      allPredictions: prediction.all_predictions,
    });

    await scan.save();

    res.status(201).json({
      scan: {
        id: scan._id,
        prediction: scan.prediction,
        predictionKey: scan.predictionKey,
        confidence: scan.confidence,
        riskLevel: scan.riskLevel,
        heatmap: scan.heatmapBase64,
        allPredictions: scan.allPredictions,
        imagePath: scan.imagePath,
        createdAt: scan.createdAt,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to process image" });
  }
});

/**
 * GET /api/scan/history
 * Get current user's scan history
 */
router.get("/history", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const scans = await Scan.find({ userId: req.user._id })
      .select("-heatmapBase64") // Exclude large heatmap data from list
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Scan.countDocuments({ userId: req.user._id });

    res.json({
      scans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ message: "Failed to fetch scan history" });
  }
});

/**
 * GET /api/scan/:id
 * Get a single scan by ID (includes heatmap)
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const scan = await Scan.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    res.json({ scan });
  } catch (error) {
    console.error("Get scan error:", error);
    res.status(500).json({ message: "Failed to fetch scan" });
  }
});

/**
 * DELETE /api/scan/:id
 * Delete a scan owned by the current user
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const scan = await Scan.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    // Remove the uploaded image file from disk
    if (scan.imagePath) {
      const fullPath = path.join(__dirname, "..", scan.imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await Scan.findByIdAndDelete(req.params.id);
    res.json({ message: "Scan deleted successfully" });
  } catch (error) {
    console.error("Delete scan error:", error);
    res.status(500).json({ message: "Failed to delete scan" });
  }
});

module.exports = router;
