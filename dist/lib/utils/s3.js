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
exports.generatePresignedUrl = exports.uploadParams = exports.S3_BUCKET_NAME = exports.s3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("../../config"));
exports.s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
exports.S3_BUCKET_NAME = config_1.default.env == "development" ? process.env.S3_BUCKET_NAME_STAGING : process.env.S3_BUCKET_NAME;
const uploadParams = (fileName, buffer, mimeType) => {
    const params = {
        Bucket: exports.S3_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: mimeType,
    };
    return params;
};
exports.uploadParams = uploadParams;
const generatePresignedUrl = (imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: exports.S3_BUCKET_NAME,
        Key: imagePath,
        Expires: 120
    };
    const uploadUrl = yield exports.s3.getSignedUrlPromise("putObject", params);
    return uploadUrl;
});
exports.generatePresignedUrl = generatePresignedUrl;
