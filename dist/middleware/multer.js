"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const MIME_TYPE = {
    "image/png": "png",
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
};
const storage = multer_1.default.diskStorage({
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(" ").join("-");
        const ext = MIME_TYPE[file.mimetype];
        cb(null, name + Date.now() + "." + ext);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
