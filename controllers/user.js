const express = require("express");
const authenticate = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
import User from "../models/user.js";
// const router = express.Router();

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    if(req.body.userId===req.params.id || req.body.role==="admin"){

        try {
            // const updatedData = req.body;

    let avatarLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.avatar) &&
      req.files.avatar.length > 0
    ) {
      avatarLocalPath = req.files?.avatar[0]?.path;
      console.log(avatarLocalPath);
    }
    
    // if (!avatarLocalPath) throw  ApiError(400, "Avatar file is required!");
    // console.log(avatarLocalPath, coverLocalPath);
    let avatar = null;
    if (avatarLocalPath) {
        avatar = await uplaodCloudinary(avatarLocalPath);
    }
    
    const updatedData = { avatar: newAvatarUrl };
    
    const user = await User.findByIdAndUpdate(req.params.id, {$set:req.body}, {
        new: true,
    });
    res.json(user);
} catch (error) {
    res.status(500).json({ message: "Error updating profile" });
}
}
else{
    return res.status(403).json({message:"you can update only your account"})
}
});

export { getUserProfile, updateUserProfile };
