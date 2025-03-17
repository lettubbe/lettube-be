"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProfileController_1 = require("../controllers/profile/ProfileController");
const multer_1 = __importDefault(require("../middleware/multer"));
const protect_1 = require("../middleware/protect");
const router = express_1.default.Router();
router.post("/upload/profilePicture", [protect_1.protect, multer_1.default.single("profilePicture")], ProfileController_1.updateProfilePhoto);
router.post("/upload/coverPhoto", [protect_1.protect, multer_1.default.single("coverPhoto")], ProfileController_1.uploadCoverPhoto);
exports.default = router;
