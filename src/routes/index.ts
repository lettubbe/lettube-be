import express from "express";

const router = express.Router();

import AuthRoute from "./AuthRoute";
import ProfileRoute from "./ProfileRoute";
import CategoryRoute from "./CategoryRoute";

router.use("/auth", AuthRoute);
router.use("/profile", ProfileRoute);
router.use("/category", CategoryRoute);

export default router;