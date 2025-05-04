"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protect_1 = require("../middleware/protect");
const NotificationsController_1 = require("../controllers/notifications/NotificationsController");
const router = express_1.default.Router();
router.get("/device/:deviceToken", protect_1.protect, NotificationsController_1.getUserPushToken);
exports.default = router;
