import express from "express";
import { bulkSubscribe, subscribe, unsubscribe } from "../controllers/subscriptions/SubscriptionController";
import { protect } from "../middleware/protect";

const router = express();

router.post("/bulk", protect, bulkSubscribe);
router.post("/subscribe/:userId", protect, subscribe);
router.post("/unsubscribe/:userId", protect, unsubscribe);

export default router;