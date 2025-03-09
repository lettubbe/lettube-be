import express from "express";

const router = express.Router();

import AuthRoute from "./AuthRoute";
import ProfileRoute from "./ProfileRoute";
import CategoryRoute from "./CategoryRoute";
import SubscriptionRoute from "./SubscriptionRoute";

router.use("/auth", AuthRoute);
router.use("/profile", ProfileRoute);
router.use("/category", CategoryRoute);
router.use("/subscription", SubscriptionRoute);

export default router;