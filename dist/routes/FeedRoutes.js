"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FeedController_1 = require("../controllers/feed/FeedController");
const protect_1 = require("../middleware/protect");
const router = express_1.default.Router();
router.post("/category", protect_1.protect, FeedController_1.createCategoryFeeds);
exports.default = router;
