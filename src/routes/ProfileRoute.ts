import express from "express";
import {
  getUserProfile,
  updateProfileDetails,
  updateProfilePhoto,
  uploadCoverPhoto,
} from "../controllers/profile/ProfileController";
import upload from "../middleware/multer";
import { protect } from "../middleware/protect";

const router = express.Router();

router.post(
  "/upload/profilePicture",
  [protect, upload.single("profilePicture")],
  updateProfilePhoto
);

router.post(
  "/upload/coverPhoto",
  [protect, upload.single("coverPhoto")],
  uploadCoverPhoto
);

router.get("/me/", protect, getUserProfile);

router.patch("/profileDetails/", protect, updateProfileDetails);

export default router;
