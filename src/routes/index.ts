import express from "express";

const router = express.Router();

import AuthRoute from "././Auth/AuthRoute";
import ProfileRoute from "././Auth/ProfileRoute";
import CategoryRoute from "././feed/CategoryRoute";
import SubscriptionRoute from "././feed/SubscriptionRoute";
import FeedRoute from "././feed/FeedRoutes";
import PlaylistRoute from "././feed/Playlist";
import NoticationsRoute from "./NotificationsRoute";
import reportRoutes from '././feed/ReportRoutes';

router.use("/auth", AuthRoute);
router.use("/profile", ProfileRoute);
router.use("/category", CategoryRoute);
router.use("/subscription", SubscriptionRoute);
router.use("/feeds", FeedRoute);
router.use("/playlist", PlaylistRoute);
router.use("/notifications", NoticationsRoute);
router.use('/reports', reportRoutes);

export default router;