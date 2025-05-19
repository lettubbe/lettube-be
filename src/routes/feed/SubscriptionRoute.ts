import express from "express";
import { bulkSubscribe, getSubscribedTo, getSubscribers, subscribe, unsubscribe } from "../../controllers/subscriptions/SubscriptionController";
import { protect } from "../../middleware/protect";

const router = express();

router.post("/bulk", protect, bulkSubscribe);
router.post("/subscribe/:userId", protect, subscribe);
router.post("/unsubscribe/:userId", protect, unsubscribe);
router.get("/subscribers", protect, getSubscribers);
router.get("/subscribedTo", protect, getSubscribedTo);

export default router;