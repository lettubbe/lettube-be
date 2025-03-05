import express from "express";
import { updateProfilePhoto } from "../controllers/profile/ProfileController";
import upload from "../middleware/multer";

const router = express.Router();

router.post("/upload/profilePicture", upload.single("profilePicture"), updateProfilePhoto);

export default router;