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
exports.updateProfilePhoto = exports.updateUserProfile = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const User_1 = __importDefault(require("../../models/User"));
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
const fileUpload_1 = require("../../lib/utils/fileUpload");
// @route   /api/v1/profile/upload/internationalPassport
// @desc    Upload International Passport
// @access  Private
exports.updateUserProfile = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, firstName, lastName } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return next(new ErrorResponse_1.default(`User Not Found`, 404));
    }
    // Update the fields
    if (firstName) {
        user.firstName = firstName;
    }
    if (lastName) {
        user.lastName = lastName;
    }
    // // Save the updated user
    yield user.save();
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        success: true,
        message: "Profile updated successfully",
        data: user,
    });
}));
// @route   /api/v1/profile/upload/profilePhoto
// @desc    Upload Profile Picture
// @access  Private/public
exports.updateProfilePhoto = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return next(new ErrorResponse_1.default(`User Not Found`, 404));
    }
    const picture = yield (0, fileUpload_1.uploadFile)(req, next, "profilePicture");
    if (!picture) {
        return next(new ErrorResponse_1.default(`Failed to upload profile picture`, 500));
    }
    user.profilePicture = picture;
    yield user.save();
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        message: `Profile Picture Uploaded Successfully`,
        success: true,
        data: user
    });
}));
