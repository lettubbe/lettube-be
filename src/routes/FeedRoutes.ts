import express from "express";
import { createCategoryFeeds } from "../controllers/feed/FeedController";
import { protect } from "../middleware/protect";

const router = express.Router();

router.post("/category", protect, createCategoryFeeds)

export default router;