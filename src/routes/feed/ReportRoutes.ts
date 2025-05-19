import express from "express";
import { protect } from "../../middleware/protect";
import { createReport, getUserReports } from "../../controllers/report/ReportController";

const router = express.Router();

router.post('/', protect, createReport);
router.get('/', protect, getUserReports);

export default router;