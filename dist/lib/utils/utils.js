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
exports.getRemoteVideoDuration = exports.normalizePhoneNumber = exports.buildUserAuthTypeQuery = exports.removeSensitiveFields = exports.formatCurrency = exports.getAuthUser = void 0;
const User_1 = __importDefault(require("../../models/User"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const tmp_1 = __importDefault(require("tmp"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffprobe_static_1 = __importDefault(require("ffprobe-static"));
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
fluent_ffmpeg_1.default.setFfprobePath(ffprobe_static_1.default.path);
const getAuthUser = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    console.log("user 123", req.user);
    if (!userId) {
        return next(new ErrorResponse_1.default(`User Id is required`, 400));
    }
    const user = yield User_1.default.findOne({ _id: userId });
    console.log("logged in user 456", user);
    if (!user) {
        return next(new ErrorResponse_1.default(`User Id is required`, 400));
    }
    return user;
});
exports.getAuthUser = getAuthUser;
const formatCurrency = (amount) => {
    return `NGN${amount.toLocaleString("en-NG")}`;
};
exports.formatCurrency = formatCurrency;
const removeSensitiveFields = (user, fields = ["password"]) => {
    const userData = Object.assign({}, user.toObject());
    fields.forEach((field) => delete userData[field]);
    return userData;
};
exports.removeSensitiveFields = removeSensitiveFields;
const buildUserAuthTypeQuery = (email, phoneNumber, userId) => {
    const query = {};
    if (email)
        query.email = email.toLowerCase();
    if (phoneNumber)
        query.phoneNumber = phoneNumber;
    if (userId)
        query._id = userId;
    return query;
};
exports.buildUserAuthTypeQuery = buildUserAuthTypeQuery;
const normalizePhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/\D/g, '').slice(-10);
};
exports.normalizePhoneNumber = normalizePhoneNumber;
const getRemoteVideoDuration = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const tmpFile = tmp_1.default.fileSync({ postfix: ".mp4" });
        try {
            const writer = fs_1.default.createWriteStream(tmpFile.name);
            const response = yield axios_1.default.get(url, { responseType: "stream" });
            response.data.pipe(writer);
            writer.on("finish", () => {
                fluent_ffmpeg_1.default.ffprobe(tmpFile.name, (err, metadata) => {
                    tmpFile.removeCallback(); // Clean up temp file
                    if (err)
                        return reject(err);
                    const duration = metadata.format.duration;
                    if (!duration)
                        return reject(new Error("Could not extract duration"));
                    resolve(duration);
                });
            });
            writer.on("error", (err) => {
                tmpFile.removeCallback();
                reject(err);
            });
        }
        catch (error) {
            tmpFile.removeCallback();
            reject(error);
        }
    }));
});
exports.getRemoteVideoDuration = getRemoteVideoDuration;
