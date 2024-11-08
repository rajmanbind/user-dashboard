const express = require("express");
const User = require("../models/user.js");
const { getUserProfile, updateUserProfile } = require("../controllers/user");
const { default: verifyJWT } = require("../middlewares/authmiddlerwares");

const router = express.Router();

// Get user profile
router.get("/:id", verifyJWT, getUserProfile);

// Update user profile
router.put(
  "/:id",
  verifyJWT,
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  updateUserProfile
);

module.exports = router;
