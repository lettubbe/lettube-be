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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protect_1 = require("../../middleware/protect");
const phoneContactsValidationSchema_1 = __importStar(require("../../middleware/validation/feeds/phoneContactsValidationSchema"));
const categoryValidationSchema_1 = __importStar(require("../../middleware/validation/feeds/categoryValidationSchema"));
const FeedController_1 = require("../../controllers/feed/FeedController");
const multer_1 = __importDefault(require("../../middleware/multer"));
const commentOnPostValidationSchema_1 = __importStar(require("../../middleware/validation/feeds/commentOnPostValidationSchema"));
const router = express_1.default.Router();
router.post("/category", [(0, categoryValidationSchema_1.default)(categoryValidationSchema_1.validateAddCategoryFeedSchema), protect_1.protect], FeedController_1.createCategoryFeeds);
router.post("/contacts", [(0, phoneContactsValidationSchema_1.default)(phoneContactsValidationSchema_1.validatePhoneContactsSchema), protect_1.protect], FeedController_1.getContacts);
router.get("/", protect_1.protect, FeedController_1.getUserFeeds);
router.get("/uploads", protect_1.protect, FeedController_1.getUserUploadedFeeds);
router.get("/uploads/public", protect_1.protect, FeedController_1.getUserPublicUploadedFeeds);
router.post("/upload", [protect_1.protect, multer_1.default.fields([{ name: "thumbnailImage" }, { name: "postVideo" }])], FeedController_1.uploadFeedPost);
router.patch("/upload/:postId", [protect_1.protect, multer_1.default.fields([{ name: "thumbnailImage" }, { name: "postVideo" }])], FeedController_1.editFeedPost);
router.get("/bookmarks", protect_1.protect, FeedController_1.getBookmarkedPosts);
router.get("/notifications", protect_1.protect, FeedController_1.getFeedNotifications);
router.get("/upload/posts/:postId", protect_1.protect, FeedController_1.getPostFeed);
router.delete("/posts/:postId", protect_1.protect, FeedController_1.deletePost);
router.get("/posts/:postId/views", protect_1.protect, FeedController_1.addVideoViews);
router.get("/posts/search", protect_1.protect, FeedController_1.searchPosts);
router.patch("/posts/:postId/like", protect_1.protect, FeedController_1.likePost);
router.patch("/posts/:postId/dislike", protect_1.protect, FeedController_1.dislikePost);
router.get("/posts/:postId/comments", protect_1.protect, FeedController_1.getPostComments);
router.patch("/posts/:postId/bookmark", protect_1.protect, FeedController_1.bookmarkPost);
router.patch("/posts/:postId/comments", [protect_1.protect, (0, commentOnPostValidationSchema_1.default)(commentOnPostValidationSchema_1.validatePostCommentSchema)], FeedController_1.commentOnPost);
router.patch("/posts/:postId/comments/:commentId/replies", protect_1.protect, FeedController_1.replyToComment);
router.patch("/posts/:postId/comments/:commentId/like", protect_1.protect, FeedController_1.likeComment);
router.delete("/posts/:postId/comments/:commentId/", protect_1.protect, FeedController_1.deletePostComment);
router.patch("/posts/:postId/comments/:commentId/replies/:replyId/like", protect_1.protect, FeedController_1.likeComment);
router.patch('/posts/:postId/playlist/:playlistId', protect_1.protect, FeedController_1.addPostToPlaylist);
router.patch('/posts/:postId/not-interested', protect_1.protect, FeedController_1.toggleNotInterested);
router.delete('/posts/:postId/playlist/:playlistId', protect_1.protect, FeedController_1.removePostFromPlaylist);
// Not interested management
router.patch('/posts/:postId/not-interested', protect_1.protect, FeedController_1.toggleNotInterested);
// Channel blocking management
router.delete('/channels/:channelId/unblock', protect_1.protect, FeedController_1.unblockChannel);
router.get("/viral", protect_1.protect, FeedController_1.getViralPosts);
router.post('/channels/:channelId/block', protect_1.protect, FeedController_1.blockChannel); // Add this new route
router.get("/posts/:postId/likes", protect_1.protect, FeedController_1.getPostLikes);
exports.default = router;
