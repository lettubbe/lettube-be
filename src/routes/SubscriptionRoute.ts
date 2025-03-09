import express from "express";
import { bulkSubscribe } from "../controllers/subscriptions/SubscriptionController";
import { protect } from "../middleware/protect";

const router = express();

router.post("/bulk", protect, bulkSubscribe);

export default router;