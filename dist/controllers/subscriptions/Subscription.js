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
exports.bulkSubscribe = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const Subscription_1 = __importDefault(require("../../models/Subscription"));
const utils_1 = require("../../lib/utils/utils");
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
// @desc    Add Bulk Subscription
// @route   /api/v1/subscription/bulk
// @access  Private
exports.bulkSubscribe = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userIds } = req.body;
    const subscriberId = yield (0, utils_1.getAuthUser)(req, next);
    if (!Array.isArray(userIds)) {
        return next(new ErrorResponse_1.default("Invalid user IDs provided", 400));
    }
    // Filter out self-subscriptions
    const filteredUserIds = userIds.filter((id) => id !== subscriberId);
    if (filteredUserIds.length === 0) {
        return next(new ErrorResponse_1.default("You cannot subscribe to yourself", 400));
    }
    // Create an array of subscription documents
    const subscriptions = filteredUserIds.map((id) => ({
        subscriber: subscriberId,
        subscribedTo: id,
    }));
    // Bulk insert subscriptions, ignoring duplicates
    yield Subscription_1.default.insertMany(subscriptions, { ordered: false });
    (0, BaseResponseHandler_1.default)({
        message: ``,
        res,
        statusCode: 201,
        success: true,
        data: subscriptions
    });
}));
