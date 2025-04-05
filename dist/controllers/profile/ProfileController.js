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
exports.getUserPublicProfile = exports.getUserProfile = exports.updateProfileDetails = exports.uploadCoverPhoto = exports.updateProfilePhoto = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const User_1 = __importDefault(require("../../models/User"));
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
const fileUpload_1 = require("../../lib/utils/fileUpload");
const utils_1 = require("../../lib/utils/utils");
// @route   /api/v1/profile/upload/profilePhoto
// @desc    Upload Profile Picture
// @access  Private/public
exports.updateProfilePhoto = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber } = req.body;
    const query = (0, utils_1.buildUserAuthTypeQuery)(email, phoneNumber);
    const user = yield User_1.default.findOne(query);
    if (!user) {
        return next(new ErrorResponse_1.default(`User Not Found`, 404));
    }
    const picture = yield (0, fileUpload_1.uploadFile)(req, next, `profilePicture/${user._id}`);
    if (!picture) {
        return next(new ErrorResponse_1.default(`Failed to upload profile picture`, 500));
    }
    user.profilePicture = picture;
    yield user.save();
    const userData = (0, utils_1.removeSensitiveFields)(user, [
        "password",
    ]);
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        message: `Profile Picture Uploaded Successfully`,
        success: true,
        data: userData,
    });
}));
// @route   /api/v1/profile/upload/coverPhoto
// @desc    Upload Profile Picture
// @access  Private
exports.uploadCoverPhoto = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const userProfile = yield User_1.default.findById(user._id);
    if (!userProfile) {
        return next(new ErrorResponse_1.default(`User Not Found`, 404));
    }
    const picture = yield (0, fileUpload_1.uploadFile)(req, next, `coverPhotos/${user._id}`);
    if (!picture) {
        return next(new ErrorResponse_1.default(`Failed to upload profile picture`, 500));
    }
    userProfile.coverPhoto = picture;
    yield userProfile.save();
    const userData = (0, utils_1.removeSensitiveFields)(user, [
        "password",
    ]);
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        message: `Cover Picture Uploaded Successfully`,
        success: true,
        data: userData,
    });
}));
// @route   /api/v1/profile/profileDetails/
// @desc    Upload Profile Picture
// @access  Private
exports.updateProfileDetails = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, firstName, lastName, displayName, websiteLink } = req.body;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const profile = yield User_1.default.findById(user._id);
    if (!profile) {
        return next(new ErrorResponse_1.default(`Profile Not Found`, 404));
    }
    if (description)
        profile.description = description;
    if (firstName)
        profile.firstName = firstName;
    if (lastName)
        profile.lastName = lastName;
    if (websiteLink)
        profile.websiteLink = websiteLink;
    if (displayName)
        profile.displayName = displayName;
    yield profile.save();
    const updatedUser = yield User_1.default.findById(user._id).select("-password");
    (0, BaseResponseHandler_1.default)({
        message: `Profile details updated successfully`,
        res,
        statusCode: 200,
        success: true,
        data: updatedUser,
    });
}));
// @route   /api/v1/profile/me/
// @desc    get User Profile 
// @access  Private
exports.getUserProfile = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const userData = (0, utils_1.removeSensitiveFields)(user, ["password"]);
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        message: `User Profile retrived Successfully`,
        success: true,
        data: userData
    });
}));
// @route   /api/v1/profile/:userId/userProfile
// @desc    get User Profile 
// @access  Private
exports.getUserPublicProfile = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield User_1.default.findById(userId).select("-password");
    if (!user) {
        return next(new ErrorResponse_1.default(`User Not Found`, 404));
    }
    const userData = (0, utils_1.removeSensitiveFields)(user, ["password"]);
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        message: `User Profile retrived Successfully`,
        success: true,
        data: userData
    });
}));
