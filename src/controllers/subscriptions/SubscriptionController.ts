import asyncHandler from "express-async-handler";
import ErrorResponse from "../../messages/ErrorResponse";
import Subscription from "../../models/Feed/Subscription";
import { getAuthUser } from "../../lib/utils/utils";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import NotificationService from "../../services/notificationService";
import User from "../../models/Auth/User";
import Notification from "../../models/Notifications";
import { getPaginateOptions, transformPaginateResponse } from "../../lib/utils/paginate";

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
    "firstName lastName username profilePicture"
  );

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
  
  const user = await getAuthUser(req, next);

  const userId = user._id;

  const { page = 1, limit = 10 } = req.query;

  const options = getPaginateOptions(page, limit, {
    paginate: [
       {
        path: "subscriber",
        select: "username firstName lastName profilePicture",
      } 
    ]
  });

  const subscribers = await Subscription.paginate({ subscribedTo: userId }, options)

  // const subscribers = await Subscription.find({
  //   subscribedTo: userId,
  // }).populate("subscriber", "firstName lastName username");

  const subsribersData = transformPaginateResponse(subscribers);

  baseResponseHandler({
    message: `Subscribers Retrieved Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: subsribersData
  });

});

// @desc    Get User Subscribers
// @route   /api/v1/subscription/subscribedTo
// @access  Private

export const getSubscribedTo = asyncHandler(async (req, res, next) => {
  const user = await getAuthUser(req, next);

  const subscriberId = user._id;

  const { limit = 10, page = 1 } = req.query;

  // const subscriptions = await Subscription.find({
  //   subscriber: subscriberId,
  // }).populate("subscribedTo", "firstName lastName username");

  const options = getPaginateOptions(page, limit, {
    populate: [
      {
        path: "subscribedTo",
        select: "username firstName lastName profilePicture",
      }
    ],
  });

  const subscriptions =  await Subscription.paginate({subscriber: subscriberId}, options);

  const subscriptionsData = transformPaginateResponse(subscriptions);

  baseResponseHandler({
    message: `Subscribed To Retrieved Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: subscriptionsData,
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
