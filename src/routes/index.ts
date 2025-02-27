import express from "express";

const router = express.Router();

import AuthRoute from "./AuthRoute";

router.use("/auth", AuthRoute);

export default router;