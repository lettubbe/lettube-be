"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protect_1 = require("../../middleware/protect");
const ReportController_1 = require("../../controllers/report/ReportController");
const router = express_1.default.Router();
router.post('/', protect_1.protect, ReportController_1.createReport);
router.get('/', protect_1.protect, ReportController_1.getUserReports);
exports.default = router;
