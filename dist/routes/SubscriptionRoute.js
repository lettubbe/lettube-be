"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SubscriptionController_1 = require("../controllers/subscriptions/SubscriptionController");
const protect_1 = require("../middleware/protect");
const router = (0, express_1.default)();
router.post("/bulk", protect_1.protect, SubscriptionController_1.bulkSubscribe);
router.post("/subscribe/:userId", protect_1.protect, SubscriptionController_1.subscribe);
router.post("/unsubscribe/:userId", protect_1.protect, SubscriptionController_1.unsubscribe);
router.get("/subscribers", protect_1.protect, SubscriptionController_1.getSubscribers);
router.get("/subscribedTo", protect_1.protect, SubscriptionController_1.getSubscribedTo);
exports.default = router;
