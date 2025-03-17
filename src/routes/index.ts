import express from "express";

const router = express.Router();

import AuthRoute from "./AuthRoute";
import ProfileRoute from "./ProfileRoute";
import CategoryRoute from "./CategoryRoute";
import SubscriptionRoute from "./SubscriptionRoute";
import FeedRoute from "./FeedRoutes";
import PlaylistRoute from "./Playlist";

router.use("/auth", AuthRoute);
router.use("/profile", ProfileRoute);
router.use("/category", CategoryRoute);
router.use("/subscription", SubscriptionRoute);
router.use("/feeds", FeedRoute);
router.use("/playlist", PlaylistRoute);

export default router;