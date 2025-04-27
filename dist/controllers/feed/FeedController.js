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
exports.dislikePost = exports.commentOnPost = exports.getPostComments = exports.likeComment = exports.replyToComment = exports.likePost = exports.uploadFeedPost = exports.getContacts = exports.getUserPublicUploadedFeeds = exports.getUserUploadedFeeds = exports.getUserFeeds = exports.createCategoryFeeds = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Feed_1 = __importDefault(require("../../models/Feed"));
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
const utils_1 = require("../../lib/utils/utils");
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const User_1 = __importDefault(require("../../models/User"));
const Post_1 = __importDefault(require("../../models/Post"));
const paginate_1 = require("../../lib/utils/paginate");
const fileUpload_1 = require("../../lib/utils/fileUpload");
const mongoose_1 = __importDefault(require("mongoose")); // make sure mongoose is imported
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
exports.getUserFeeds = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    console.log("user", user);
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
    console.log("posts", posts);
    const postsData = (0, paginate_1.transformPaginateResponse)(posts);
    // console.log("postsData", postsData);
    (0, BaseResponseHandler_1.default)({
        message: `User Feeds Retrived successfully`,
        res,
        statusCode: 200,
        success: true,
        data: postsData,
    });
}));
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
        message: `User Feeds Retrived successfully`,
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
    const { page, limit, userId } = req.params;
    const options = (0, paginate_1.getPaginateOptions)(page, limit);
    const posts = yield Post_1.default.paginate({ user: userId }, options);
    const postsTransformedData = (0, paginate_1.transformPaginateResponse)(posts);
    (0, BaseResponseHandler_1.default)({
        message: `User Feeds Retrived successfully`,
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
    const thumbnailImage = yield (0, fileUpload_1.uploadFileFromFields)(req, next, `feedThunbnail/${user._id}/thumbnails`, "thumbnailImage");
    const postVideo = yield (0, fileUpload_1.uploadFileFromFields)(req, next, `feedVideos/${user._id}/videos`, "postVideo");
    const { tags, category, description, visibility, isCommentsAllowed } = req.body;
    console.log("tags", tags);
    if (!thumbnailImage) {
        return next(new ErrorResponse_1.default(`Error Occured when uploading Thumbnail. Please Check your connection and try again`, 500));
    }
    if (!postVideo) {
        return next(new ErrorResponse_1.default(`Error Occured when uploading Video. Please Check your connection and try again`, 500));
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
    console.log("hitting like post");
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
    const { page = 1, limit = 10 } = req.query;
    const post = yield Post_1.default.findById(postId)
        .populate("comments.user comments.replies.user", "username avatar");
    if (!post) {
        return next(new ErrorResponse_1.default("Post Not Found", 404));
    }
    const comments = post.comments || [];
    const options = (0, paginate_1.getPaginateOptions)(page, limit);
    const startIndex = (options.page - 1) * options.limit;
    const endIndex = options.page * options.limit;
    // Sort manually since we are working inside arrays
    const sortedComments = [...comments].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    const paginatedComments = sortedComments.slice(startIndex, endIndex);
    const paginationResult = {
        docs: paginatedComments,
        totalDocs: comments.length,
        limit: options.limit,
        totalPages: Math.ceil(comments.length / options.limit),
        page: options.page,
        pagingCounter: startIndex + 1,
        hasPrevPage: options.page > 1,
        hasNextPage: endIndex < comments.length,
        prevPage: options.page > 1 ? options.page - 1 : null,
        nextPage: endIndex < comments.length ? options.page + 1 : null,
    };
    (0, BaseResponseHandler_1.default)({
        message: "Post Comments Retrieved Successfully",
        res,
        statusCode: 200,
        success: true,
        data: (0, paginate_1.transformPaginateResponse)(paginationResult),
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
