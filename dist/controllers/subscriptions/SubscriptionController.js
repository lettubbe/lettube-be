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
exports.bulkSubscribe = exports.getSubscribedTo = exports.getSubscribers = exports.unsubscribe = exports.subscribe = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const Subscription_1 = __importDefault(require("../../models/Feed/Subscription"));
const utils_1 = require("../../lib/utils/utils");
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
const notificationService_1 = __importDefault(require("../../services/notificationService"));
const User_1 = __importDefault(require("../../models/Auth/User"));
const Notifications_1 = __importDefault(require("../../models/Notifications"));
const paginate_1 = require("../../lib/utils/paginate");
// @desc    Subscribe to a channel
// @route   /api/v1/subscription/subscribe
// @access  Private
exports.subscribe = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    if (user._id == userId) {
        return next(new ErrorResponse_1.default("You cannot subscribe to yourself", 400));
    }
    const subscription = yield Subscription_1.default.create({
        subscriber: user._id,
        subscribedTo: userId,
    });
    const subscribedUser = yield User_1.default.findById(userId).select("firstName lastName username profilePicture");
    if (!subscribedUser) {
        return next(new ErrorResponse_1.default("Subscribed user not found", 404));
    }
    yield notificationService_1.default.sendNotification(userId, {
        title: `New Subscription`,
        description: `${user.username} Just Subscribed Your Channel`,
    });
    Notifications_1.default.create({
        userId,
        type: "subscription",
        read: false,
    });
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 201,
        data: subscription,
        message: "Subscription successful",
        success: true,
    });
}));
// @desc    Unsubscribe from a channel
// @route   /api/v1/subscription/unsubscribe
// @access  Private
exports.unsubscribe = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const subscription = yield Subscription_1.default.findOneAndDelete({
        subscriber: user._id,
        subscribedTo: userId,
    });
    if (!subscription) {
        return next(new ErrorResponse_1.default("Subscription not found", 404));
    }
    (0, BaseResponseHandler_1.default)({
        message: `You have unsubscribe successfully`,
        res,
        statusCode: 200,
        success: true,
        data: subscription,
    });
}));
// @desc    Get User Subscribers
// @route   /api/v1/subscription/subscribers
// @access  Private
exports.getSubscribers = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const userId = user._id;
    const { page = 1, limit = 10 } = req.query;
    const options = (0, paginate_1.getPaginateOptions)(page, limit, {
        paginate: [
            {
                path: "subscriber",
                select: "username firstName lastName profilePicture",
            }
        ]
    });
    const subscribers = yield Subscription_1.default.paginate({ subscribedTo: userId }, options);
    // const subscribers = await Subscription.find({
    //   subscribedTo: userId,
    // }).populate("subscriber", "firstName lastName username");
    const subsribersData = (0, paginate_1.transformPaginateResponse)(subscribers);
    (0, BaseResponseHandler_1.default)({
        message: `Subscribers Retrieved Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: subsribersData
    });
}));
// @desc    Get User Subscribers
// @route   /api/v1/subscription/subscribedTo
// @access  Private
exports.getSubscribedTo = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const subscriberId = user._id;
    const { limit = 10, page = 1 } = req.query;
    // const subscriptions = await Subscription.find({
    //   subscriber: subscriberId,
    // }).populate("subscribedTo", "firstName lastName username");
    const options = (0, paginate_1.getPaginateOptions)(page, limit, {
        populate: [
            {
                path: "subscribedTo",
                select: "username firstName lastName profilePicture",
            }
        ],
    });
    const subscriptions = yield Subscription_1.default.paginate({ subscriber: subscriberId }, options);
    const subscriptionsData = (0, paginate_1.transformPaginateResponse)(subscriptions);
    (0, BaseResponseHandler_1.default)({
        message: `Subscribed To Retrieved Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: subscriptionsData,
    });
}));
// @desc    Bulk Subscribe Users
// @route   /api/v1/subscriptions/bulk
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
        message: `Bulk subscription successful`,
        res,
        statusCode: 200,
        success: true,
        data: `Bulk subscription successful`,
    });
}));
