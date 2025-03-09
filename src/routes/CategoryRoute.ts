import express from "express";
import { getCategories } from "../controllers/auth/CategoryController";

const router = express.Router();

router.get("/", getCategories);

export default router;