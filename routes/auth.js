import express from "express";
const router = express.Router();
import { loginUser, registerUser } from "../controllers/auth.js";
import { upload } from "../middlewares/multer.js";

router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  registerUser
);

router.post("/login", loginUser);
export default router;
