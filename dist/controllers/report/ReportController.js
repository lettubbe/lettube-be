"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const Report_1 = __importStar(require("../../models/Feed/Report"));
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const utils_1 = require("../../lib/utils/utils");
const Post_1 = __importDefault(require("../../models/Feed/Post"));
const User_1 = __importDefault(require("../../models/Auth/User"));
// @desc    Create a report
// @route   POST /api/v1/reports
// @access  Private
exports.createReport = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, category, reason, type } = req.body;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    if (!type || !Object.values(Report_1.ReportType).includes(type)) {
        return next(new ErrorResponse_1.default('Invalid report type', 400));
    }
    let existingReport;
    if (type === Report_1.ReportType.POST) {
        const post = yield Post_1.default.findById(id);
        if (!post) {
            return next(new ErrorResponse_1.default('Post not found', 404));
        }
        existingReport = yield Report_1.default.findOne({
            user: user._id,
            post: id,
            type: Report_1.ReportType.POST
        });
    }
    else {
        const channel = yield User_1.default.findById(id);
        if (!channel) {
            return next(new ErrorResponse_1.default('Channel not found', 404));
        }
        existingReport = yield Report_1.default.findOne({
            user: user._id,
            channel: id,
            type: Report_1.ReportType.CHANNEL
        });
    }
    if (existingReport) {
        return next(new ErrorResponse_1.default(`You have already reported this ${type}`, 400));
    }
    const reportData = {
        user: user._id,
        category,
        reason,
        type,
        post: undefined,
        channel: undefined
    };
    if (type === Report_1.ReportType.POST) {
        reportData.post = id;
    }
    else {
        reportData.channel = id;
    }
    const report = yield Report_1.default.create(reportData);
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
    const { type } = req.query;
    let query = { user: user._id };
    if (type && Object.values(Report_1.ReportType).includes(type)) {
        query = Object.assign(Object.assign({}, query), { type: type });
    }
    const reports = yield Report_1.default.find(query)
        .populate('post', 'title description')
        .populate('channel', 'username email')
        .sort('-createdAt');
    (0, BaseResponseHandler_1.default)({
        message: 'Reports retrieved successfully',
        res,
        statusCode: 200,
        success: true,
        data: reports
    });
}));
