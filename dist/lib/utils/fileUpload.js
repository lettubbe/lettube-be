"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileFromFields = exports.uploadFile = void 0;
const uuid_1 = require("uuid");
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const s3_1 = require("./s3");
const uploadFile = (req, next, folder) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    console.log("upload file", file);
    if (!file) {
        return next(new ErrorResponse_1.default("No file uploaded", 400));
    }
    console.log("file", file);
    const fileExtension = file.originalname.split(".").pop();
    const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folder}/${(0, uuid_1.v4)()}.${fileExtension}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    try {
        const uploadResult = yield s3_1.s3.upload(s3Params).promise();
        return uploadResult.Location;
    }
    catch (error) {
        console.log("error uploading profile picture", error);
        next(new ErrorResponse_1.default("Error uploading file", 500));
    }
});
exports.uploadFile = uploadFile;
const uploadFileFromFields = (req, next, folder, fieldName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const files = req.files;
    // Ensure files is the expected shape
    if (!files || typeof files !== "object" || Array.isArray(files)) {
        return next(new ErrorResponse_1.default(`Invalid file format for field "${fieldName}"`, 400));
    }
    const file = (_a = files[fieldName]) === null || _a === void 0 ? void 0 : _a[0];
    if (!file) {
        return next(new ErrorResponse_1.default(`No file uploaded for field "${fieldName}"`, 400));
    }
    const fileExtension = file.originalname.split(".").pop();
    const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folder}/${(0, uuid_1.v4)()}.${fileExtension}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    try {
        const uploadResult = yield s3_1.s3.upload(s3Params).promise();
        return uploadResult.Location;
    }
    catch (error) {
        console.error("Error uploading file to S3:", error);
        next(new ErrorResponse_1.default("Error uploading file", 500));
    }
});
exports.uploadFileFromFields = uploadFileFromFields;
