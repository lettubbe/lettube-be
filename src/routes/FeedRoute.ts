import express from "express";
import { createCategoryFeeds } from "../controllers/feed/FeedController";

const router = express.Router();


router.post("/category", createCategoryFeeds);

export default router;