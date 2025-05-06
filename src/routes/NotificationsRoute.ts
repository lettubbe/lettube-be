import express from "express";
import { protect } from "../middleware/protect";
import { getUserPushToken } from "../controllers/notifications/NotificationsController";

const router = express.Router();

router.get("/device/:deviceToken", protect, getUserPushToken);

export default router;