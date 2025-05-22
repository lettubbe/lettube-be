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
exports.unblockChannel = exports.removePostFromPlaylist = exports.blockChannel = exports.toggleNotInterested = exports.getViralPosts = exports.searchPosts = exports.addPostToPlaylist = exports.deletePost = exports.getUserFeeds = exports.getBookmarkedPosts = exports.bookmarkPost = exports.dislikePost = exports.deletePostComment = exports.commentOnPost = exports.getPostComments = exports.likeComment = exports.replyToComment = exports.getFeedNotificationsCount = exports.getFeedNotifications = exports.likePost = exports.getPostFeed = exports.editFeedPost = exports.uploadFeedPost = exports.getContacts = exports.getUserPublicUploadedFeeds = exports.addVideoViews = exports.getUserUploadedFeeds = exports.createCategoryFeeds = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Feed_1 = __importDefault(require("../../models/Feed/Feed"));
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
const utils_1 = require("../../lib/utils/utils");
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const User_1 = __importDefault(require("../../models/Auth/User"));
const Post_1 = __importDefault(require("../../models/Feed/Post"));
const paginate_1 = require("../../lib/utils/paginate");
const fileUpload_1 = require("../../lib/utils/fileUpload");
const mongoose_1 = __importStar(require("mongoose"));
const Playlist_1 = __importDefault(require("../../models/Feed/Playlist"));
const Bookmark_1 = __importDefault(require("../../models/Feed/Bookmark"));
const Notifications_1 = __importDefault(require("../../models/Notifications"));
const notificationService_1 = __importDefault(require("../../services/notificationService"));
const commentService_1 = require("../../services/commentService");
const NotInterested_1 = __importDefault(require("../../models/Feed/NotInterested"));
const BlockedChannel_1 = __importDefault(require("../../models/Feed/BlockedChannel"));
const NotificationEnums_1 = require("../../constants/enums/NotificationEnums");
const VideoViews_1 = __importDefault(require("../../models/Feed/VideoViews"));
exports.createCategoryFeeds = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categories = [], excludedCategories = [] } = req.body;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    // Find an existing feed document for the user
    let categoryFeed = yield Feed_1.default.findOne({ user: user._id });
    // const authUser = await Auth.findOne({ user: user._id});
    // if(!authUser){
    //   return next(new ErrorResponse(`User Profile Not found`, 404));
    // }
    if (!categoryFeed) {
        // If no document exists, create a new one
        categoryFeed = new Feed_1.default({
            user: user._id,
            categories,
            excludedCategories,
        });
    }
    else {
        // Merge new categories while ensuring uniqueness
        const updatedCategories = Array.from(new Set([...categoryFeed.categories, ...categories]));
        const updatedExcludedCategories = Array.from(new Set([...categoryFeed.excludedCategories, ...excludedCategories]));
        // Ensure no category is both included and excluded
        categoryFeed.categories = updatedCategories.filter((cat) => !updatedExcludedCategories.includes(cat));
        categoryFeed.excludedCategories = updatedExcludedCategories.filter((cat) => !updatedCategories.includes(cat));
    }
    // authUser.isCategorySet = true;
    yield categoryFeed.save();
    // await authUser.save();
    (0, BaseResponseHandler_1.default)({
        message: "Category Feed Updated Successfully",
        res,
        statusCode: 201,
        success: true,
        data: categoryFeed,
    });
}));
// @desc     Get User Feed
// @route   GET /api/v1/feed/uploads
// @access  private
exports.getUserUploadedFeeds = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const { page = 1, limit = 10, search = "", mode = "latest", } = req.query;
    const options = yield getPostsQuery({ page, search, mode, limit });
    const posts = yield Post_1.default.paginate({ user: user._id }, options);
    const postsTransformedData = (0, paginate_1.transformPaginateResponse)(posts);
    (0, BaseResponseHandler_1.default)({
        message: `User Feeds Retrieved successfully`,
        res,
        statusCode: 200,
        success: true,
        data: postsTransformedData,
    });
}));
// @desc     Get User Feed
// @route   GET /api/v1/feed/:postId/views
// @access  private
exports.addVideoViews = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const { postId } = req.params;
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new ErrorResponse_1.default(`Post Not Found`, 404));
    }
    const video = yield VideoViews_1.default.findOne({ post: postId });
    if (!video) {
        VideoViews_1.default.create({ post: postId });
    }
    if (video && !video.views.includes(user._id)) {
        video.views.push(user._id);
        yield video.save();
    }
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        data: video,
        success: true,
        message: `Video Viewed successfully`
    });
}));
// @desc     Get User Feed
// @route   GET /api/v1/feed/uploads/user/public
// @access  private
exports.getUserPublicUploadedFeeds = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    const { page = 1, limit = 10, search = "", mode = "latest", } = req.query;
    const options = yield getPostsQuery({ page, search, mode, limit });
    const posts = yield Post_1.default.paginate({ user: userId }, options);
    const postsTransformedData = (0, paginate_1.transformPaginateResponse)(posts);
    (0, BaseResponseHandler_1.default)({
        message: `User Feeds Retrieved successfully`,
        res,
        statusCode: 200,
        success: true,
        data: postsTransformedData,
    });
}));
// @desc     Get User Feed
// @route    GET /api/v1/feed/phoneNumbers
// @access   Private
exports.getContacts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumbers } = req.body;
    if (!Array.isArray(phoneNumbers)) {
        return next(new ErrorResponse_1.default("phoneNumbers must be a non-empty array", 400));
    }
    // Normalize the incoming phone numbers
    const normalizedNumbers = phoneNumbers.map((num) => (0, utils_1.normalizePhoneNumber)(num));
    // Use a regular expression to match the last 8-10 digits
    const contacts = yield User_1.default.find({
        phoneNumber: {
            $regex: new RegExp(normalizedNumbers.map((num) => num).join("|")),
        },
    }).select("firstName lastName phoneNumber email profilePicture");
    (0, BaseResponseHandler_1.default)({
        message: "Contacts Retrieved Successfully",
        res,
        statusCode: 200,
        success: true,
        data: contacts || [],
    });
}));
// @desc     Get User Feed
// @route    GET /api/v1/feed/upload
// @access   Private
exports.uploadFeedPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    let tagsArray;
    console.log("body", req.body);
    const thumbnailImage = yield (0, fileUpload_1.uploadFileFromFields)(req, next, `feedThumbnail/${user._id}/thumbnails`, "thumbnailImage");
    const postVideo = yield (0, fileUpload_1.uploadFileFromFields)(req, next, `feedVideos/${user._id}/videos`, "postVideo");
    const { tags, category, description, visibility, playlistId, isCommentsAllowed, } = req.body;
    if (!thumbnailImage) {
        return next(new ErrorResponse_1.default(`Error Occurred when uploading Thumbnail. Please Check your connection and try again`, 500));
    }
    if (!postVideo) {
        return next(new ErrorResponse_1.default(`Error Occurred when uploading Video. Please Check your connection and try again`, 500));
    }
    // tagsArray =
    //   typeof tags === "string" ? JSON.parse(tags.replace(/'/g, '"')) : tags;
    console.log("tags", tags);
    // Split comma-separated string into array
    tagsArray = typeof tags === "string" ? tags.split(",") : tags;
    if (!tagsArray || tagsArray.length === 0) {
        return next(new ErrorResponse_1.default("tags is required", 400));
    }
    const isCommentsAllowedBool = String(isCommentsAllowed).toLowerCase() === "true";
    if (tagsArray.length == 0) {
        return next(new ErrorResponse_1.default(`tags is required`, 400));
    }
    const duration = yield (0, utils_1.getRemoteVideoDuration)(postVideo);
    const postFeed = {
        user: user._id,
        tags: tagsArray,
        category,
        description,
        visibility,
        duration,
        isCommentsAllowed: isCommentsAllowedBool,
        videoUrl: postVideo,
        thumbnail: thumbnailImage,
    };
    const post = yield Post_1.default.create(postFeed);
    if (playlistId) {
        const playlist = yield Playlist_1.default.findById(playlistId);
        if (!playlist) {
            return next(new ErrorResponse_1.default("Playlist not found", 404));
        }
        playlist.videos.push(post._id);
        yield playlist.save();
    }
    (0, BaseResponseHandler_1.default)({
        message: "Post Created Successfully",
        res,
        statusCode: 200,
        success: true,
        data: post,
    });
}));
// @desc     Edit User Feed Post
// @route    PATCH /api/v1/feed/upload/:postId
// @access   Private
exports.editFeedPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const { postId } = req.params;
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new ErrorResponse_1.default("Post not found", 404));
    }
    // Only allow post owner to edit
    if (String(post.user) !== String(user._id)) {
        return next(new ErrorResponse_1.default("Not authorized to edit this post", 403));
    }
    const { tags, category, description, visibility, isCommentsAllowed, playlistId } = req.body;
    let tagsArray;
    if (tags) {
        tagsArray = typeof tags === "string" ? tags.split(",") : tags;
        if (!Array.isArray(tagsArray) || tagsArray.length === 0) {
            return next(new ErrorResponse_1.default("tags is required", 400));
        }
        post.tags = tagsArray;
    }
    if (category)
        post.category = category;
    if (description)
        post.description = description;
    if (visibility)
        post.visibility = visibility;
    if (isCommentsAllowed !== undefined) {
        post.isCommentsAllowed = String(isCommentsAllowed).toLowerCase() === "true";
    }
    // Replace thumbnail if provided
    const newThumbnail = yield (0, fileUpload_1.uploadFileFromFields)(req, next, `feedThumbnail/${user._id}/thumbnails`, "thumbnailImage", true);
    if (newThumbnail) {
        post.thumbnail = newThumbnail;
    }
    // Replace video if provided
    const newVideo = yield (0, fileUpload_1.uploadFileFromFields)(req, next, `feedVideos/${user._id}/videos`, "postVideo", true);
    if (newVideo) {
        post.videoUrl = newVideo;
        post.duration = yield (0, utils_1.getRemoteVideoDuration)(newVideo);
    }
    if (playlistId) {
        const playlist = yield Playlist_1.default.findById(playlistId);
        if (!playlist) {
            return next(new ErrorResponse_1.default("Playlist not found", 404));
        }
        // Avoid duplicate entries
        if (!playlist.videos.includes(post._id)) {
            playlist.videos.push(post._id);
            yield playlist.save();
        }
    }
    yield post.save();
    (0, BaseResponseHandler_1.default)({
        message: "Post Updated Successfully",
        res,
        statusCode: 200,
        success: true,
        data: post,
    });
}));
// @desc     Edit User Feed Post
// @route    GET /api/v1/feed/upload/:postId
// @access   Private
exports.getPostFeed = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const post = yield Post_1.default.findById(postId).select("-comments");
    if (!postId) {
        return next(new ErrorResponse_1.default(`Post Not Found`, 404));
    }
    (0, BaseResponseHandler_1.default)({
        message: `Post Retrieved Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: post
    });
}));
// @desc     Get User Feed
// @route    GET /api/v1/feed/:postId/like
// @access   Private
exports.likePost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const userId = user._id;
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new ErrorResponse_1.default(`Post Not Found`, 404));
    }
    const hasLiked = post.reactions.likes.some((id) => id.toString() === userId.toString());
    const update = hasLiked
        ? {
            $pull: { "reactions.likes": userId },
        }
        : {
            $addToSet: { "reactions.likes": userId },
            $pull: { "reactions.dislikes": userId },
        };
    const updatedPost = yield Post_1.default.findByIdAndUpdate(postId, update, {
        new: true,
        runValidators: true,
    });
    if (!hasLiked) {
        const existing = yield Notifications_1.default.findOne({
            userId: post.user,
            type: "like",
            videoId: postId,
        });
        if (existing) {
            if (!existing.actorIds.includes(user._id)) {
                existing.actorIds.push(user._id);
                existing.createdAt = new Date();
                yield existing.save();
                yield notificationService_1.default.sendNotification(post.user, {
                    title: `{existing.actorIds.length} liked your post`,
                    description: `${user.username} liked your post`,
                });
            }
        }
        else {
            yield Notifications_1.default.create({
                userId: post.user,
                actorIds: [user._id],
                post: postId,
                subType: "postLike",
                type: "like",
                videoId: postId,
                createdAt: new Date(),
                read: false,
            });
        }
        yield notificationService_1.default.sendNotification(post.user, {
            title: `${user.username} liked your post`,
            description: `${user.username} Just liked your post`,
        });
    }
    (0, BaseResponseHandler_1.default)({
        message: `Post Liked Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.reactions,
    });
}));
// @desc     Get User Feed
// @route    GET /api/v1/feed/notifications
// @access   Private
exports.getFeedNotifications = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const { page, limit, type } = req.query;
    console.log("type", type);
    const filter = {
        userId: user._id,
    };
    // If type is provided and valid, add it to the filter
    if (type && ["like", "comment", "subscription"].includes(type)) {
        filter.type = type;
    }
    if (type && ["reply"].includes(type)) {
        filter.subType = "replyLike";
    }
    console.log("filter", filter);
    const options = (0, paginate_1.getPaginateOptions)(page, limit, {
        populate: [
            {
                path: "userId",
                select: "username firstName lastName profilePicture",
            },
            {
                path: "post",
            },
            {
                path: "actorIds",
                select: "username firstName lastName profilePicture",
            },
        ],
    });
    const notificationsData = yield Notifications_1.default.paginate(filter, options);
    const notifications = (0, paginate_1.transformPaginateResponse)(notificationsData);
    yield Notifications_1.default.updateMany({ userId: user._id, status: NotificationEnums_1.NotificationStatusEnum.UNREAD }, { $set: { status: NotificationEnums_1.NotificationStatusEnum.READ } });
    // console.log("notifications", notifications);
    (0, BaseResponseHandler_1.default)({
        message: `User Notifications Retrieved successfully`,
        res,
        statusCode: 200,
        success: true,
        data: notifications,
    });
}));
// @desc     Get User Feed
// @route    GET /api/v1/feed/notifications/count
// @access   Private
exports.getFeedNotificationsCount = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const notifications = yield Notifications_1.default.countDocuments({
        read: true,
        userId: user._id,
    });
    res
        .status(200)
        .json({ success: true, data: notifications, statusCode: 200 });
}));
// @desc      Liking a comment or reply to a comment
// @route     /posts/:postId/comments/:commentId/replies/:replyId/like
//            /posts/:postId/comments/:commentId/like
// @access    Private
exports.replyToComment = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, commentId } = req.params;
    const { text } = req.body;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new ErrorResponse_1.default(`Post Not Found`, 404));
    }
    const comment = post.comments.find((c) => c._id.toString() === commentId);
    if (!comment) {
        return next(new ErrorResponse_1.default(`Comment not found`, 404));
    }
    const newReply = {
        user: user._id,
        text,
        likes: [],
        createdAt: new Date(),
    };
    // @ts-ignore
    comment.replies.push(newReply);
    yield post.save();
    const commentNotificationPayload = {
        title: `Reply to your comment`,
        description: `${user.username} replied to your comment`,
    };
    const now = new Date();
    const existingNotification = yield Notifications_1.default.findOne({
        userId: comment.user,
        type: 'comment',
        commentId: commentId
    });
    if (existingNotification) {
        if (!existingNotification.actorIds.includes(user._id)) {
            existingNotification.actorIds.push(user._id);
            existingNotification.createdAt = now;
            yield existingNotification.save();
            const existingCommentNotificationPayload = {
                title: `Reply to your comment`,
                description: `${existingNotification.actorIds.length} replied to your comment`,
            };
            yield notificationService_1.default.sendNotification(comment.user, existingCommentNotificationPayload);
        }
    }
    else {
        yield Notifications_1.default.create({
            userId: comment.user,
            actorIds: [user._id],
            type: 'comment',
            videoId: postId,
            commentId: commentId,
            read: false,
        });
        yield notificationService_1.default.sendNotification(comment.user, commentNotificationPayload);
    }
    yield Notifications_1.default.create({ userId: comment.user, actorIds: [user._id], post: postId, type: "comment", videoId: postId, createdAt: new Date(), read: false });
    yield Notifications_1.default.create({
        userId: comment.user,
        actorIds: [user._id],
        post: postId,
        type: "comment",
        videoId: postId,
        createdAt: new Date(),
        read: false,
    });
    // await NotificationService.sendNotification(comment.user as any, {});
    (0, BaseResponseHandler_1.default)({
        message: `Reply Done Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: comment,
    });
}));
// @desc       Like A Comment
// @route      /posts/:postId/comments/:commentId/replies
// @access     Private
exports.likeComment = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, commentId, replyId } = req.params;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const userId = user._id;
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new ErrorResponse_1.default(`Post Not Found`, 404));
    }
    const comment = post.comments.find((c) => c._id.toString() === commentId);
    if (!comment) {
        return next(new ErrorResponse_1.default(`Comment Not Found`, 404));
    }
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId); // <- ensure correct type
    if (replyId) {
        // Like/Unlike a REPLY
        const reply = comment.replies.find((r) => r._id.toString() === replyId);
        if (!reply) {
            return next(new ErrorResponse_1.default(`Reply Not Found`, 404));
        }
        const alreadyLiked = reply.likes.some((id) => id.toString() === userId.toString());
        const update = alreadyLiked
            ? {
                $pull: { "comments.$[comment].replies.$[reply].likes": userObjectId },
            }
            : {
                $addToSet: {
                    "comments.$[comment].replies.$[reply].likes": userObjectId,
                },
            };
        yield Post_1.default.updateOne({
            _id: postId,
            "comments._id": commentId,
            "comments.replies._id": replyId,
        }, update, {
            arrayFilters: [
                { "comment._id": new mongoose_1.default.Types.ObjectId(commentId) },
                { "reply._id": new mongoose_1.default.Types.ObjectId(replyId) },
            ],
        });
        if (!alreadyLiked) {
            const existing = yield Notifications_1.default.findOne({
                userId: reply.user,
                type: "like",
                videoId: postId,
                commentId: replyId,
            });
            if (existing) {
                if (!existing.actorIds.includes(user._id)) {
                    existing.actorIds.push(user._id);
                    existing.createdAt = new Date();
                    yield existing.save();
                    yield notificationService_1.default.sendNotification(reply.user, {
                        title: `${existing.actorIds.length} people liked your reply`,
                        description: `${user.username} liked your reply`,
                    });
                }
            }
            else {
                yield Notifications_1.default.create({
                    userId: reply.user,
                    actorIds: [user._id],
                    post: postId,
                    subType: "replyLike",
                    commentText: reply.text,
                    type: "like",
                    videoId: postId,
                    commentId: replyId,
                    createdAt: new Date(),
                    read: false,
                });
                yield notificationService_1.default.sendNotification(reply.user, {
                    title: `${user.username} liked your reply`,
                    description: `${user.username} liked your reply to a comment`,
                });
            }
        }
    }
    else {
        const alreadyLiked = comment.likes.some((id) => id.toString() === userId.toString());
        const update = alreadyLiked
            ? { $pull: { "comments.$.likes": userObjectId } }
            : { $addToSet: { "comments.$.likes": userObjectId } };
        yield Post_1.default.updateOne({
            _id: postId,
            "comments._id": commentId,
        }, update);
        if (!alreadyLiked) {
            const existing = yield Notifications_1.default.findOne({
                userId: comment.user,
                type: "like",
                videoId: postId,
                commentId: commentId,
            });
            if (existing) {
                if (!existing.actorIds.includes(user._id)) {
                    existing.actorIds.push(user._id);
                    existing.createdAt = new Date();
                    yield existing.save();
                    yield notificationService_1.default.sendNotification(comment.user, {
                        title: `${existing.actorIds.length} people liked your comment`,
                        description: `${user.username} liked your comment`,
                    });
                }
            }
            else {
                yield Notifications_1.default.create({
                    userId: comment.user,
                    actorIds: [user._id],
                    type: "like",
                    subType: "commentLike",
                    post: postId,
                    videoId: postId,
                    commentId: commentId,
                    commentText: comment.text,
                    createdAt: new Date(),
                    read: false,
                });
                yield notificationService_1.default.sendNotification(comment.user, {
                    title: `${user.username} liked your comment`,
                    description: `${user.username} liked your comment on a post`,
                });
            }
        }
    }
    const updatedPost = yield Post_1.default.findById(postId);
    return (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        success: true,
        message: "Action performed successfully",
        data: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.comments,
    });
}));
// @desc      get Comments On A Post
// @route     GET /posts/:postId/comments
// @access    Private
exports.getPostComments = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { page = 1, limit = 10, search = "", mode = "newest", } = req.query;
    const query = (0, commentService_1.getCommentsQuery)(postId, { page, limit, search, mode });
    const post = yield query;
    if (!post) {
        return next(new ErrorResponse_1.default("Post Not Found", 404));
    }
    const transformedComments = post.comments.map((comment) => ({
        _id: comment._id,
        user: comment.user,
        text: comment.text,
        likes: comment.likes,
        replies: comment.replies.map((reply) => ({
            _id: reply._id,
            user: reply.user,
            text: reply.text,
            likes: reply.likes,
            createdAt: reply.createdAt,
        })),
        createdAt: comment.createdAt,
    }));
    const totalComments = yield Post_1.default.findById(postId)
        .select("comments")
        .then((p) => { var _a; return ((_a = p === null || p === void 0 ? void 0 : p.comments) === null || _a === void 0 ? void 0 : _a.length) || 0; });
    // Calculate pagination info
    const totalPages = Math.ceil(totalComments / Number(limit));
    const hasNextPage = Number(page) * Number(limit) < totalComments;
    const hasPrevPage = Number(page) > 1;
    (0, BaseResponseHandler_1.default)({
        message: transformedComments.length
            ? "Post Comments Retrieved Successfully"
            : "No Comments Found",
        res,
        statusCode: 200,
        success: true,
        data: (0, paginate_1.transformPaginateResponse)({
            docs: transformedComments,
            totalDocs: totalComments,
            limit: Number(limit),
            totalPages,
            page: Number(page),
            pagingCounter: (Number(page) - 1) * Number(limit) + 1,
            hasPrevPage,
            hasNextPage,
            prevPage: hasPrevPage ? Number(page) - 1 : null,
            nextPage: hasNextPage ? Number(page) + 1 : null,
        }),
    });
}));
// @desc      Make Comment On A Post
// @route     /posts/:postId/comments
// @access    Private
exports.commentOnPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { text } = req.body;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const newComment = {
        user: user._id,
        text,
        likes: [],
        replies: [],
        createdAt: new Date(),
    };
    const post = yield Post_1.default.findByIdAndUpdate(postId, { $push: { comments: newComment } }, { new: true, runValidators: true });
    if (!post) {
        return next(new ErrorResponse_1.default(`Post Not Found`, 404));
    }
    yield Notifications_1.default.create({
        userId: post.user,
        actorIds: [user._id],
        type: "comment",
        commentText: text,
        post: postId,
        createdAt: new Date(),
        read: false,
    });
    // Send push notification
    yield notificationService_1.default.sendNotification(post.user, {
        title: `${user.username} commented on your post`,
        description: `${user.username} commented: ${text.substring(0, 50)}${text.length > 50 ? "..." : ""}`,
    });
    (0, BaseResponseHandler_1.default)({
        message: `Comment Added Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: post.comments,
    });
}));
// @desc      Delete Comment On A Post
// @route     /posts/:postId/comments/:commentId/:postId
// @access    Private
exports.deletePostComment = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId, postId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(commentId) || !mongoose_1.default.Types.ObjectId.isValid(postId)) {
        return next(new ErrorResponse_1.default("Invalid comment or post ID", 400));
    }
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new ErrorResponse_1.default("Post not found", 404));
    }
    const commentIndex = post.comments.findIndex((comment) => comment._id.toString() === commentId);
    if (commentIndex === -1) {
        return next(new ErrorResponse_1.default("Comment not found", 404));
    }
    post.comments.splice(commentIndex, 1);
    yield post.save();
    (0, BaseResponseHandler_1.default)({
        res,
        message: "Comment deleted successfully",
        success: true,
        data: post.comments,
        statusCode: 200
    });
}));
// @desc      Dislike A Post
// @route     /posts/:postId/dislike
// @access    Private
exports.dislikePost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const userId = req.user._id;
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new ErrorResponse_1.default(`Post Not Found`, 404));
    }
    const hasDisliked = post.reactions.dislikes.some((id) => id.toString() === userId.toString());
    const update = hasDisliked
        ? {
            // User already disliked → remove from dislikes
            $pull: { "reactions.dislikes": userId },
        }
        : {
            // User not disliked yet → add to dislikes
            $addToSet: { "reactions.dislikes": userId },
            $pull: { "reactions.likes": userId }, // Remove from likes if any
        };
    const updatedPost = yield Post_1.default.findByIdAndUpdate(postId, update, {
        new: true,
        runValidators: true,
    });
    (0, BaseResponseHandler_1.default)({
        message: `Post Disliked Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.reactions,
    });
}));
// @desc      Bookmark Video
// @route     POST /posts/:postId/bookmark
// @access    Private
exports.bookmarkPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const userId = user._id;
    // Check if post exists
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new ErrorResponse_1.default(`Post Not Found`, 404));
    }
    // Check if already bookmarked
    const existingBookmark = yield Bookmark_1.default.findOne({
        user: userId,
        post: postId,
    });
    if (existingBookmark) {
        // Remove bookmark
        yield Bookmark_1.default.deleteOne({ _id: existingBookmark._id });
        (0, BaseResponseHandler_1.default)({
            message: "Post Unbookmarked Successfully",
            res,
            statusCode: 200,
            success: true,
            data: { isBookmarked: false },
        });
    }
    else {
        // Add new bookmark
        const bookmark = yield Bookmark_1.default.create({ user: userId, post: postId });
        (0, BaseResponseHandler_1.default)({
            message: "Post Bookmarked Successfully",
            res,
            statusCode: 200,
            success: true,
            data: { isBookmarked: true },
        });
    }
}));
// @desc      Get User's Bookmarked Posts
// @route     GET /posts/bookmarks
// @access    Private
exports.getBookmarkedPosts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const { page, limit, searchTerm } = req.query;
    const options = (0, paginate_1.getPaginateOptions)(page, limit, {
        populate: {
            path: "post",
            populate: {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        }
    });
    const bookmarks = yield Bookmark_1.default.paginate({ user: user._id }, options);
    // Transform the response to return posts with isBookmarked flag
    const transformedData = Object.assign(Object.assign({}, bookmarks), { docs: bookmarks.docs.map((bookmark) => {
            var _a;
            return (Object.assign(Object.assign({}, (_a = bookmark.post) === null || _a === void 0 ? void 0 : _a.toObject()), { isBookmarked: true }));
        }) });
    (0, BaseResponseHandler_1.default)({
        message: "Bookmarked Posts Retrieved Successfully",
        res,
        statusCode: 200,
        success: true,
        data: (0, paginate_1.transformPaginateResponse)(transformedData),
    });
}));
// @desc      Get User's Feed Posts
// @route     GET /posts/feed
// @access    Private
// export const getUserFeeds = asyncHandler(async (req, res, next) => {
//   const user = await getAuthUser(req, next);
//   const { page, limit } = req.query;
//   // Get posts IDs that user is not interested in
//   const notInterestedPosts = await NotInterestedModel.find({ user: user._id })
//     .select('post')
//     .lean();
//   const notInterestedPostIds = notInterestedPosts.map(item => item.post);
//   const options = getPaginateOptions(page, limit, {
//     populate: [
//       {
//         path: "user",
//         select: "username firstName lastName profilePicture",
//       },
//     ],
//   });
//   // Add not interested filter to query
//   const query = {
//     _id: { $nin: notInterestedPostIds }
//   };
//   const posts = await Post.paginate(query, options);
//   // Get user's bookmarks for these posts
//   const bookmarks = await Bookmark.find({
//     user: user._id,
//     post: { $in: posts.docs.map((post) => (post as any)._id) },
//   });
//   const bookmarkedPostIds = new Set(bookmarks.map((b) => b.post.toString()));
//   // Transform and clean up the response data
//   const cleanPosts = {
//     ...posts,
//     docs: posts.docs.map((post) => {
//       const postObj = (post as any).toObject();
//       return {
//         _id: postObj._id,
//         user: {
//           _id: postObj.user._id,
//           username: postObj.user.username,
//           firstName: postObj.user.firstName,
//           lastName: postObj.user.lastName,
//           profilePicture: postObj.user.profilePicture,
//         },
//         category: postObj.category,
//         thumbnail: postObj.thumbnail,
//         videoUrl: postObj.videoUrl,
//         description: postObj.description,
//         visibility: postObj.visibility,
//         tags: postObj.tags,
//         isCommentsAllowed: postObj.isCommentsAllowed,
//         reactions: postObj.reactions,
//         comments: postObj.comments,
//         createdAt: postObj.createdAt,
//         updatedAt: postObj.updatedAt,
//         duration: postObj.duration,
//         isBookmarked: bookmarkedPostIds.has(postObj._id.toString()),
//       };
//     }),
//   };
//   baseResponseHandler({
//     message: `User Feeds Retrieved successfully`,
//     res,
//     statusCode: 200,
//     success: true,
//     data: transformPaginateResponse(cleanPosts),
//   });
// });
exports.getUserFeeds = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const { page, limit } = req.query;
    // Get posts IDs that user is not interested in
    const notInterestedPosts = yield NotInterested_1.default.find({ user: user._id })
        .select('post')
        .lean();
    const notInterestedPostIds = notInterestedPosts.map(item => item.post);
    const options = (0, paginate_1.getPaginateOptions)(page, limit, {
        populate: [
            {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        ],
    });
    // Filter out not interested posts
    const query = {
        _id: { $nin: notInterestedPostIds }
    };
    const posts = yield Post_1.default.paginate(query, options);
    const postIds = posts.docs.map((post) => post._id);
    // Get user's bookmarks for these posts
    const bookmarks = yield Bookmark_1.default.find({
        user: user._id,
        post: { $in: postIds },
    });
    const bookmarkedPostIds = new Set(bookmarks.map((b) => b.post.toString()));
    // Get views for all posts in one query
    const videoViews = yield VideoViews_1.default.find({ post: { $in: postIds } }).lean();
    const viewCountsMap = new Map();
    videoViews.forEach((v) => {
        viewCountsMap.set(v.post.toString(), v.views.length);
    });
    // Transform and clean up the response data
    const cleanPosts = Object.assign(Object.assign({}, posts), { docs: posts.docs.map((post) => {
            const postObj = post.toObject();
            const postIdStr = postObj._id.toString();
            return {
                _id: postObj._id,
                user: {
                    _id: postObj.user._id,
                    username: postObj.user.username,
                    firstName: postObj.user.firstName,
                    lastName: postObj.user.lastName,
                    profilePicture: postObj.user.profilePicture,
                },
                category: postObj.category,
                thumbnail: postObj.thumbnail,
                videoUrl: postObj.videoUrl,
                description: postObj.description,
                visibility: postObj.visibility,
                tags: postObj.tags,
                isCommentsAllowed: postObj.isCommentsAllowed,
                reactions: postObj.reactions,
                comments: postObj.comments,
                createdAt: postObj.createdAt,
                updatedAt: postObj.updatedAt,
                duration: postObj.duration,
                isBookmarked: bookmarkedPostIds.has(postIdStr),
                views: viewCountsMap.get(postIdStr) || 0, // <-- Add views here
            };
        }) });
    (0, BaseResponseHandler_1.default)({
        message: `User Feeds Retrieved successfully`,
        res,
        statusCode: 200,
        success: true,
        data: (0, paginate_1.transformPaginateResponse)(cleanPosts),
    });
}));
// @desc      Get User's Feed Posts
// @route     DELETE /posts/feed/:postId/
// @access    Private
exports.deletePost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const userId = user._id;
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new ErrorResponse_1.default(`Post Not Found`, 404));
    }
    if (post.user.toString() !== userId.toString()) {
        return next(new ErrorResponse_1.default(`You are not authorized to delete this post`, 403));
    }
    yield Post_1.default.findByIdAndDelete(postId);
    (0, BaseResponseHandler_1.default)({
        message: `Post Deleted Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: post,
    });
}));
// @desc    Add post to playlist
// @route   PATCH /api/v1/feed/posts/:postId/playlist/:playlistId
// @access  Private
exports.addPostToPlaylist = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, playlistId } = req.params;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const playlist = yield Playlist_1.default.findOne({ _id: playlistId, user: user._id });
    if (!playlist) {
        return next(new ErrorResponse_1.default('Playlist not found or unauthorized', 404));
    }
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new ErrorResponse_1.default('Post not found', 404));
    }
    if (playlist.videos.includes(new mongoose_1.Types.ObjectId(postId))) {
        return next(new ErrorResponse_1.default('Post already in playlist', 400));
    }
    playlist.videos.push(new mongoose_1.Types.ObjectId(postId));
    yield playlist.save();
    (0, BaseResponseHandler_1.default)({
        message: 'Post added to playlist successfully',
        res,
        statusCode: 200,
        success: true,
        data: playlist
    });
}));
// @desc      Get User's Feed Posts
// @route     GET /posts/feed/search?searchTerm=keyword
// @access    Private
exports.searchPosts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page = 1, limit = 10, } = req.query;
    const searchQuery = searchTerm === null || searchTerm === void 0 ? void 0 : searchTerm.trim();
    const filter = {};
    // Prepare list of OR filters
    const orFilters = [];
    if (searchQuery) {
        // 1. Search for users whose names match the searchTerm
        const matchingUsers = yield User_1.default.find({
            $or: [
                { firstName: { $regex: searchQuery, $options: "i" } },
                { lastName: { $regex: searchQuery, $options: "i" } },
                { username: { $regex: searchQuery, $options: "i" } },
            ],
        }).select("_id");
        const userIds = matchingUsers.map((user) => user._id);
        orFilters.push({ category: { $regex: searchQuery, $options: "i" } }, { description: { $regex: searchQuery, $options: "i" } }, { tags: { $in: [new RegExp(searchQuery, "i")] } }, { "comments.text": { $regex: searchQuery, $options: "i" } }, { "comments.replies.text": { $regex: searchQuery, $options: "i" } });
        // If there are matching users, include their IDs in the filter
        if (userIds.length > 0) {
            orFilters.push({ user: { $in: userIds } });
        }
    }
    // Only public posts
    filter.visibility = "public";
    if (orFilters.length > 0) {
        filter.$or = orFilters;
    }
    const options = (0, paginate_1.getPaginateOptions)(page, limit, {
        populate: [
            {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        ],
        sort: { createdAt: -1 },
    });
    const postsData = yield Post_1.default.paginate(filter, options);
    const posts = (0, paginate_1.transformPaginateResponse)(postsData);
    (0, BaseResponseHandler_1.default)({
        message: `Search Results for "${searchQuery}"`,
        res,
        statusCode: 200,
        success: true,
        data: posts,
    });
}));
// @desc      Get Viral Posts
// @route     GET /api/v1/feed/viral
// @access    Private
exports.getViralPosts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = req.query;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    // Calculate exactly 30 days ago
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const aggregatePipeline = [
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo },
                visibility: "public",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: "$user",
        },
        {
            $addFields: {
                likesCount: { $size: "$reactions.likes" },
                commentsCount: { $size: "$comments" },
                user: {
                    username: "$user.username",
                    firstName: "$user.firstName",
                    lastName: "$user.lastName",
                    profilePicture: "$user.profilePicture",
                },
            },
        },
        {
            $sort: {
                likesCount: -1,
                commentsCount: -1,
            },
        },
    ];
    const options = (0, paginate_1.getPaginateOptions)(page, limit, {
        populate: [
            {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        ],
    });
    const posts = yield Post_1.default.aggregate(aggregatePipeline)
        .skip(options.page)
        .limit(options.limit);
    const totalDocs = yield Post_1.default.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
        visibility: "public",
    });
    // Get user's bookmarks for these posts
    const bookmarks = yield Bookmark_1.default.find({
        user: user._id,
        post: { $in: posts.map((post) => post._id) },
    });
    const bookmarkedPostIds = new Set(bookmarks.map((b) => b.post.toString()));
    // Transform the posts with consistent structure
    const transformedPosts = posts.map((post) => ({
        _id: post._id,
        user: {
            _id: post.user._id,
            username: post.user.username,
            firstName: post.user.firstName,
            lastName: post.user.lastName,
            profilePicture: post.user.profilePicture,
        },
        category: post.category,
        thumbnail: post.thumbnail,
        videoUrl: post.videoUrl,
        description: post.description,
        visibility: post.visibility,
        tags: post.tags,
        isCommentsAllowed: post.isCommentsAllowed,
        reactions: post.reactions,
        comments: post.comments,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        isBookmarked: bookmarkedPostIds.has(post._id.toString()),
        metrics: {
            likesCount: post.likesCount,
            commentsCount: post.commentsCount,
        },
    }));
    const paginatedResponse = {
        docs: transformedPosts,
        totalDocs,
        limit: Number(options.limit),
        page: Number(options.page),
        totalPages: Math.ceil(totalDocs / Number(options.limit)),
    };
    (0, BaseResponseHandler_1.default)({
        message: "Viral posts retrieved successfully",
        res,
        statusCode: 200,
        success: true,
        data: (0, paginate_1.transformPaginateResponse)(paginatedResponse),
    });
}));
// @desc    Mark post as not interested
// @route   POST /api/v1/feed/posts/:postId/not-interested
// @access  Private
exports.toggleNotInterested = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return next(new ErrorResponse_1.default('Post not found', 404));
    }
    const existingNotInterested = yield NotInterested_1.default.findOne({
        user: user._id,
        post: postId
    });
    if (existingNotInterested) {
        yield NotInterested_1.default.deleteOne({ _id: existingNotInterested._id });
        (0, BaseResponseHandler_1.default)({
            message: 'Post removed from not interested',
            res,
            statusCode: 200,
            success: true,
            data: { status: 'removed' }
        });
    }
    else {
        const notInterested = yield NotInterested_1.default.create({
            user: user._id,
            post: postId
        });
        (0, BaseResponseHandler_1.default)({
            message: 'Post marked as not interested',
            res,
            statusCode: 200,
            success: true,
            data: { status: 'added', notInterested }
        });
    }
}));
// @desc    Block channel from recommendations
// @route   POST /api/v1/feed/channels/:channelId/block
// @access  Private
exports.blockChannel = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { channelId } = req.params;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const channelUser = yield User_1.default.findById(channelId);
    if (!channelUser) {
        return next(new ErrorResponse_1.default('Channel not found', 404));
    }
    const blockedChannel = yield BlockedChannel_1.default.create({
        user: user._id,
        blockedUser: channelId
    });
    (0, BaseResponseHandler_1.default)({
        message: 'Channel blocked from recommendations',
        res,
        statusCode: 200,
        success: true,
        data: blockedChannel
    });
}));
// @desc    Remove post from playlist
// @route   DELETE /api/v1/feed/posts/:postId/playlist/:playlistId
// @access  Private
exports.removePostFromPlaylist = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, playlistId } = req.params;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const playlist = yield Playlist_1.default.findOne({ _id: playlistId, user: user._id });
    if (!playlist) {
        return next(new ErrorResponse_1.default('Playlist not found or unauthorized', 404));
    }
    if (!playlist.videos.includes(new mongoose_1.Types.ObjectId(postId))) {
        return next(new ErrorResponse_1.default('Post not in playlist', 404));
    }
    playlist.videos = playlist.videos.filter(videoId => videoId.toString() !== postId);
    yield playlist.save();
    (0, BaseResponseHandler_1.default)({
        message: 'Post removed from playlist successfully',
        res,
        statusCode: 200,
        success: true,
        data: playlist
    });
}));
// @desc    Unblock channel from recommendations
// @route   DELETE /api/v1/feed/channels/:channelId/block
// @access  Private
exports.unblockChannel = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { channelId } = req.params;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const blockedChannel = yield BlockedChannel_1.default.findOne({
        user: user._id,
        blockedUser: channelId
    });
    if (!blockedChannel) {
        return next(new ErrorResponse_1.default('Channel not blocked', 404));
    }
    yield BlockedChannel_1.default.deleteOne({ _id: blockedChannel._id });
    (0, BaseResponseHandler_1.default)({
        message: 'Channel unblocked successfully',
        res,
        statusCode: 200,
        success: true,
        data: { status: 'unblocked' }
    });
}));
