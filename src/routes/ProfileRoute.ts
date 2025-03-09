import express from "express";
import { updateProfilePhoto } from "../controllers/profile/ProfileController";
import upload from "../middleware/multer";
import { protect } from "../middleware/protect";

const router = express.Router();

router.post(
  "/upload/profilePicture",
  [protect, upload.single("profilePicture")],
  updateProfilePhoto
);

export default router;
