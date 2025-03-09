import express from "express";

const router = express.Router();

import AuthRoute from "./AuthRoute";
import ProfileRoute from "./ProfileRoute";
import CategoryRoute from "./CategoryRoute";
import SubscriptionRoute from "./SubscriptionRoute";
import FeedRoute from "./FeedRoute";

router.use("/auth", AuthRoute);
router.use("/profile", ProfileRoute);
router.use("/category", CategoryRoute);
router.use("/subscription", SubscriptionRoute);
router.use("/feeds", FeedRoute);

export default router;