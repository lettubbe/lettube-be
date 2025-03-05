import express from "express";

const router = express.Router();

import AuthRoute from "./AuthRoute";
import ProfileRoute from "./ProfileRoute";

router.use("/auth", AuthRoute);
router.use("/profile", ProfileRoute);

export default router;