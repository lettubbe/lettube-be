"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProfileController_1 = require("../controllers/profile/ProfileController");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = express_1.default.Router();
router.post("/upload/profilePicture", multer_1.default.single("profilePicture"), ProfileController_1.updateProfilePhoto);
exports.default = router;
