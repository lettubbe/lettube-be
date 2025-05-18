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
exports.getUserReports = exports.createReport = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Report_1 = __importDefault(require("../../models/Report"));
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const utils_1 = require("../../lib/utils/utils");
const Post_1 = __importDefault(require("../../models/Post"));
// @desc    Create a report
// @route   POST /api/v1/reports
// @access  Private
exports.createReport = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, category, reason } = req.body;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new ErrorResponse_1.default('Post not found', 404));
    }
    const existingReport = yield Report_1.default.findOne({
        user: user._id,
        post: postId
    });
    if (existingReport) {
        return next(new ErrorResponse_1.default('You have already reported this post', 400));
    }
    const report = yield Report_1.default.create({
        user: user._id,
        post: postId,
        category,
        reason
    });
    (0, BaseResponseHandler_1.default)({
        message: 'Report submitted successfully',
        res,
        statusCode: 201,
        success: true,
        data: report
    });
}));
// @desc    Get user's reports
// @route   GET /api/v1/reports
// @access  Private
exports.getUserReports = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const reports = yield Report_1.default.find({ user: user._id })
        .populate('post', 'title description')
        .sort('-createdAt');
    (0, BaseResponseHandler_1.default)({
        message: 'Reports retrieved successfully',
        res,
        statusCode: 200,
        success: true,
        data: reports
    });
}));
