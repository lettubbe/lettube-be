import express from "express";
import { getCategories } from "../controllers/category/CategoryController";

const router = express.Router();

router.get("/", getCategories);

export default router;