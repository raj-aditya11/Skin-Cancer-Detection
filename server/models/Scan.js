/**
 * Scan.js — Mongoose model for scan results
 */
const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      default: "unknown",
    },
    prediction: {
      type: String,
      required: true,
    },
    predictionKey: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    heatmapBase64: {
      type: String,
      default: "",
    },
    allPredictions: [
      {
        class: String,
        confidence: Number,
      },
    ],
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
scanSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Scan", scanSchema);
