/**
 * admin.js — Admin routes for managing users and scans
 */
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const User = require("../models/User");
const Scan = require("../models/Scan");

const router = express.Router();

// All admin routes require auth + admin role
router.use(auth, admin);

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalScans = await Scan.countDocuments();
    const highRiskScans = await Scan.countDocuments({ riskLevel: "High" });
    const recentScans = await Scan.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    res.json({
      totalUsers,
      totalScans,
      highRiskScans,
      recentScans,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

/**
 * GET /api/admin/users
 * List all users
 */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    // Get scan count per user
    const usersWithScans = await Promise.all(
      users.map(async (user) => {
        const scanCount = await Scan.countDocuments({ userId: user._id });
        return { ...user.toObject(), scanCount };
      })
    );

    res.json({ users: usersWithScans });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete a user and all their scans
 */
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't allow deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    // Delete user's scans
    await Scan.deleteMany({ userId: user._id });
    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User and associated scans deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

/**
 * GET /api/admin/scans
 * List all scans across all users
 */
router.get("/scans", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const scans = await Scan.find()
      .populate("userId", "name email")
      .select("-heatmapBase64")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Scan.countDocuments();

    res.json({
      scans,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch scans" });
  }
});

module.exports = router;
