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
exports.getUserFeeds = exports.getBookmarkedPosts = exports.bookmarkPost = exports.dislikePost = exports.commentOnPost = exports.getPostComments = exports.likeComment = exports.replyToComment = exports.likePost = exports.uploadFeedPost = exports.getContacts = exports.getUserPublicUploadedFeeds = exports.getUserUploadedFeeds = exports.createCategoryFeeds = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Feed_1 = __importDefault(require("../../models/Feed"));
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
const utils_1 = require("../../lib/utils/utils");
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const User_1 = __importDefault(require("../../models/User"));
const Post_1 = __importDefault(require("../../models/Post"));
const paginate_1 = require("../../lib/utils/paginate");
const fileUpload_1 = require("../../lib/utils/fileUpload");
const mongoose_1 = __importStar(require("mongoose")); // make sure mongoose is imported
const Playlist_1 = __importDefault(require("../../models/Playlist"));
const Bookmark_1 = __importDefault(require("../../models/Bookmark"));
// @desc    Add Category to user Feed
// @route   POST /api/v1/feed/category
// @access  Private
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
// @route   GET /api/v1/feed/
// @access  private
// @desc     Get User Feed
// @route   GET /api/v1/feed/uploads
// @access  private
exports.getUserUploadedFeeds = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const { page, limit } = req.params;
    const options = (0, paginate_1.getPaginateOptions)(page, limit);
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
// @route   GET /api/v1/feed/uploads/user/public
// @access  private
exports.getUserPublicUploadedFeeds = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    const { page, limit } = req.params;
    const options = (0, paginate_1.getPaginateOptions)(page, limit);
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
    console.log("hitting upload feed post");
    const user = yield (0, utils_1.getAuthUser)(req, next);
    let tagsArray;
    console.log("body", req.body);
    const thumbnailImage = yield (0, fileUpload_1.uploadFileFromFields)(req, next, `feedThumbnail/${user._id}/thumbnails`, "thumbnailImage");
    const postVideo = yield (0, fileUpload_1.uploadFileFromFields)(req, next, `feedVideos/${user._id}/videos`, "postVideo");
    const { tags, category, description, visibility, playlistId, isCommentsAllowed } = req.body;
    console.log("tags", tags);
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
    const postFeed = {
        user: user._id,
        tags: tagsArray,
        category,
        description,
        visibility,
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
        runValidators: true, // optional, but nice
    });
    (0, BaseResponseHandler_1.default)({
        message: `Post Liked Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.reactions,
    });
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
    comment.replies.push(newReply);
    yield post.save();
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
        const alreadyLiked = reply.likes.some(id => id.toString() === userId.toString());
        const update = alreadyLiked
            ? { $pull: { "comments.$[comment].replies.$[reply].likes": userObjectId } }
            : { $addToSet: { "comments.$[comment].replies.$[reply].likes": userObjectId } };
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
    }
    else {
        // Like/Unlike a COMMENT
        const alreadyLiked = comment.likes.some(id => id.toString() === userId.toString());
        const update = alreadyLiked
            ? { $pull: { "comments.$.likes": userObjectId } }
            : { $addToSet: { "comments.$.likes": userObjectId } };
        yield Post_1.default.updateOne({
            _id: postId,
            "comments._id": commentId,
        }, update);
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
    const { page = 1, limit = 10, search = "" } = req.query;
    // First check if post exists
    const postExists = yield Post_1.default.findById(postId);
    if (!postExists) {
        return next(new ErrorResponse_1.default("Post Not Found", 404));
    }
    // Build the aggregation pipeline
    const pipeline = [
        { $match: { _id: new mongoose_1.Types.ObjectId(postId) } },
        { $unwind: "$comments" }
    ];
    // Add search condition if search term exists
    if (search) {
        pipeline.push({
            $match: {
                $or: [
                    { "comments.text": { $regex: search, $options: "i" } },
                    { "comments.replies.text": { $regex: search, $options: "i" } }
                ]
            }
        });
    }
    // Add sorting, pagination and population with field filtering
    pipeline.push({ $sort: { "comments.createdAt": -1 } }, { $skip: Math.max(0, (Number(page || 1) - 1) * Number(limit)) }, { $limit: Number(limit) }, {
        $lookup: {
            from: "users",
            localField: "comments.user",
            foreignField: "_id",
            as: "comments.user",
            pipeline: [
                {
                    $project: {
                        password: 0,
                        email: 0,
                        isDeleted: 0,
                        __v: 0,
                        date: 0
                    }
                }
            ]
        }
    }, { $unwind: "$comments.user" }, {
        $lookup: {
            from: "users",
            localField: "comments.replies.user",
            foreignField: "_id",
            as: "comments.replies.user",
            pipeline: [
                {
                    $project: {
                        password: 0,
                        email: 0,
                        isDeleted: 0,
                        __v: 0,
                        date: 0
                    }
                }
            ]
        }
    }, {
        $group: {
            _id: "$_id",
            comments: { $push: "$comments" },
            totalComments: { $sum: 1 }
        }
    });
    // Execute the aggregation
    const result = yield Post_1.default.aggregate(pipeline);
    // Handle empty results
    if (result.length === 0 || !result[0].comments || result[0].comments.length === 0) {
        return (0, BaseResponseHandler_1.default)({
            message: "No Comments Found",
            res,
            statusCode: 200,
            success: true,
            data: (0, paginate_1.transformPaginateResponse)({
                docs: [],
                totalDocs: 0,
                limit: Number(limit),
                totalPages: 0,
                page: Number(page),
                pagingCounter: 0,
                hasPrevPage: false,
                hasNextPage: false,
                prevPage: null,
                nextPage: null,
            }),
        });
    }
    // Calculate pagination info
    const totalComments = result[0].totalComments;
    const totalPages = Math.ceil(totalComments / Number(limit));
    const hasNextPage = Number(page) < totalPages;
    const hasPrevPage = Number(page) > 1;
    (0, BaseResponseHandler_1.default)({
        message: "Post Comments Retrieved Successfully",
        res,
        statusCode: 200,
        success: true,
        data: (0, paginate_1.transformPaginateResponse)({
            docs: result[0].comments,
            totalDocs: totalComments,
            limit: Number(limit),
            totalPages: totalPages,
            page: Number(page),
            pagingCounter: (Number(page) - 1) * Number(limit) + 1,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
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
    (0, BaseResponseHandler_1.default)({
        message: `Comment Added Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: post.comments,
    });
}));
// @desc      Dislike A Post
// @route     /posts/:postId/dislike
// @access    Private
exports.dislikePost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hitting dislike post");
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
// @route     /posts/:postId/bookmark
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
    const existingBookmark = yield Bookmark_1.default.findOne({ user: userId, post: postId });
    if (existingBookmark) {
        // Remove bookmark
        yield Bookmark_1.default.deleteOne({ _id: existingBookmark._id });
        (0, BaseResponseHandler_1.default)({
            message: 'Post Unbookmarked Successfully',
            res,
            statusCode: 200,
            success: true,
            data: { isBookmarked: false }
        });
    }
    else {
        // Add new bookmark
        const bookmark = yield Bookmark_1.default.create({ user: userId, post: postId });
        (0, BaseResponseHandler_1.default)({
            message: 'Post Bookmarked Successfully',
            res,
            statusCode: 200,
            success: true,
            data: { isBookmarked: true }
        });
    }
}));
// @desc      Get User's Bookmarked Posts
// @route     GET /posts/bookmarks
// @access    Private
exports.getBookmarkedPosts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const { page, limit } = req.query;
    const options = (0, paginate_1.getPaginateOptions)(page, limit, {
        populate: {
            path: 'post',
            populate: {
                path: 'user',
                select: 'username firstName lastName profilePicture'
            }
        },
        sort: { createdAt: -1 }
    });
    const bookmarks = yield Bookmark_1.default.paginate({ user: user._id }, options);
    // Transform the response to return posts with isBookmarked flag
    const transformedData = Object.assign(Object.assign({}, bookmarks), { docs: bookmarks.docs.map(bookmark => {
            var _a;
            return (Object.assign(Object.assign({}, (_a = bookmark.post) === null || _a === void 0 ? void 0 : _a.toObject()), { isBookmarked: true }));
        }) });
    (0, BaseResponseHandler_1.default)({
        message: 'Bookmarked Posts Retrieved Successfully',
        res,
        statusCode: 200,
        success: true,
        data: (0, paginate_1.transformPaginateResponse)(transformedData)
    });
}));
// Modify getUserFeeds to include isBookmarked flag
exports.getUserFeeds = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const { page, limit } = req.query;
    const options = (0, paginate_1.getPaginateOptions)(page, limit, {
        populate: [
            {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        ],
    });
    const posts = yield Post_1.default.paginate({}, options);
    // Get user's bookmarks for these posts
    const bookmarks = yield Bookmark_1.default.find({
        user: user._id,
        post: { $in: posts.docs.map(post => post._id) }
    });
    const bookmarkedPostIds = new Set(bookmarks.map(b => b.post.toString()));
    // Transform and clean up the response data
    const cleanPosts = Object.assign(Object.assign({}, posts), { docs: posts.docs.map(post => {
            const postObj = post.toObject();
            return {
                _id: postObj._id,
                user: {
                    _id: postObj.user._id,
                    username: postObj.user.username,
                    firstName: postObj.user.firstName,
                    lastName: postObj.user.lastName,
                    profilePicture: postObj.user.profilePicture
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
                isBookmarked: bookmarkedPostIds.has(postObj._id.toString())
            };
        }) });
    (0, BaseResponseHandler_1.default)({
        message: `User Feeds Retrieved successfully`,
        res,
        statusCode: 200,
        success: true,
        data: (0, paginate_1.transformPaginateResponse)(cleanPosts)
    });
}));
