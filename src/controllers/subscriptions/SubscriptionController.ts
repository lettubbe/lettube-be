import asyncHandler from "express-async-handler";
import ErrorResponse from "../../messages/ErrorResponse";
import Subscription from "../../models/Subscription";
import { getAuthUser } from "../../lib/utils/utils";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import NotificationService from "../../services/notificationService";
import User from "../../models/User";
import Notification from "../../models/Notifications";

// @desc    Subscribe to a channel
// @route   /api/v1/subscription/subscribe
// @access  Private

export const subscribe = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  const user = await getAuthUser(req, next);

  if (user._id == userId) {
    return next(new ErrorResponse("You cannot subscribe to yourself", 400));
  }

  const subscription = await Subscription.create({
    subscriber: user._id,
    subscribedTo: userId,
  });

  const subscribedUser = await User.findById(userId).select(
    "firstName lastName username profilePicture");

  if (!subscribedUser) {
    return next(new ErrorResponse("Subscribed user not found", 404));
  }

  await NotificationService.sendNotification(userId as any, {
    title: `New Subscription`,
    description: `${user.username} Just Subscribed Your Channel`,
  });

  Notification.create({ 
    userId,
    type: "subscription",
    read: false, 
  });

  baseResponseHandler({
    res,
    statusCode: 201,
    data: subscription,
    message: "Subscription successful",
    success: true,
  });
});

// @desc    Unsubscribe from a channel
// @route   /api/v1/subscription/unsubscribe
// @access  Private

export const unsubscribe = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  const user = await getAuthUser(req, next);

  const subscription = await Subscription.findOneAndDelete({
    subscriber: user._id,
    subscribedTo: userId,
  });

  if (!subscription) {
    return next(new ErrorResponse("Subscription not found", 404));
  }

  baseResponseHandler({
    message: `You have unsubscribe successfully`,
    res,
    statusCode: 200,
    success: true,
    data: subscription,
  });
});

// @desc    Get User Subscribers
// @route   /api/v1/subscription/subscribers
// @access  Private

export const getSubscribers = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const subscribers = await Subscription.find({
    subscribedTo: userId,
  }).populate("subscriber", "firstName lastName username");

  res.status(200).json({
    success: true,
    data: subscribers,
  });
});

// Get who a user is subscribed to
export const getSubscribedTo = asyncHandler(async (req, res, next) => {
  const subscriberId = req.user.id;

  const subscriptions = await Subscription.find({
    subscriber: subscriberId,
  }).populate("subscribedTo", "firstName lastName username");

  res.status(200).json({
    success: true,
    data: subscriptions,
  });
});

// @desc    Bulk Subscribe Users
// @route   /api/v1/subscriptions/bulk
// @access  Private

export const bulkSubscribe = asyncHandler(async (req, res, next) => {
  const { userIds } = req.body;

  const subscriberId = await getAuthUser(req, next);

  if (!Array.isArray(userIds)) {
    return next(new ErrorResponse("Invalid user IDs provided", 400));
  }

  // Filter out self-subscriptions
  const filteredUserIds = userIds.filter((id) => id !== subscriberId);

  if (filteredUserIds.length === 0) {
    return next(new ErrorResponse("You cannot subscribe to yourself", 400));
  }

  // Create an array of subscription documents
  const subscriptions = filteredUserIds.map((id) => ({
    subscriber: subscriberId,
    subscribedTo: id,
  }));

  // Bulk insert subscriptions, ignoring duplicates
  await Subscription.insertMany(subscriptions, { ordered: false });

  baseResponseHandler({
    message: `Bulk subscription successful`,
    res,
    statusCode: 200,
    success: true,
    data: `Bulk subscription successful`,
  });

});
