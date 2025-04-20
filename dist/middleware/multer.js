"use strict";
// import multer from "multer";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const MIME_TYPE: any = {
//   "image/png": "png",
//   "image/jpg": "jpg",
//   "image/jpeg": "jpeg",
// };
// const storage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     const name = file.originalname.toLowerCase().split(" ").join("-");
//     const ext = MIME_TYPE[file.mimetype];
//     cb(null, name + Date.now() + "." + ext);
//   },
// });
// const upload = multer({ storage });
// export default upload;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
