import express from "express";
import { protect } from "../middleware/protect";
import validateGetPhoneContacts, { validatePhoneContactsSchema } from "../middleware/validation/feeds/phoneContactsValidationSchema";
import validateAddCategoryFeedRequest, { validateAddCategoryFeedSchema } from "../middleware/validation/feeds/categoryValidationSchema";
import { addPostToPlaylist, blockChannel, getPostFeed, bookmarkPost, commentOnPost, createCategoryFeeds, deletePost, deletePostComment, dislikePost, getBookmarkedPosts, getContacts, getFeedNotifications, getPostComments, getUserFeeds, getUserPublicUploadedFeeds, getUserUploadedFeeds, getViralPosts, likeComment, likePost, removePostFromPlaylist, replyToComment, searchPosts, toggleNotInterested, unblockChannel, uploadFeedPost } from "../controllers/feed/FeedController";
import upload from "../middleware/multer";
import validatePostComment, { validatePostCommentSchema } from "../middleware/validation/feeds/commentOnPostValidationSchema";

const router = express.Router();

router.post("/category", [validateAddCategoryFeedRequest(validateAddCategoryFeedSchema), protect], createCategoryFeeds);
router.post("/contacts", [validateGetPhoneContacts(validatePhoneContactsSchema), protect], getContacts);
router.get("/", protect, getUserFeeds);
router.get("/uploads", protect, getUserUploadedFeeds);
router.get("/uploads/public", protect, getUserPublicUploadedFeeds);
router.post("/upload", [protect, upload.fields([{ name: "thumbnailImage" }, { name: "postVideo" }])], uploadFeedPost);
router.get("/bookmarks", protect, getBookmarkedPosts);
router.get("/notifications", protect, getFeedNotifications);
router.get("/upload/:postId", protect, getPostFeed);

router.patch("/posts/:postId/like", protect, likePost);
router.patch("/posts/:postId/dislike", protect, dislikePost);
router.get("/posts/:postId/comments", protect, getPostComments);
router.delete("/posts/:postId", protect, deletePost);
router.get("/posts/search", protect, searchPosts); // Assuming you have a searchPosts function in your controller
router.patch("/posts/:postId/bookmark", protect, bookmarkPost);
router.patch("/posts/:postId/comments", [protect, validatePostComment(validatePostCommentSchema)], commentOnPost);
router.patch("/posts/:postId/comments/:commentId/replies", protect, replyToComment);
router.patch("/posts/:postId/comments/:commentId/like", protect, likeComment);
router.patch("/posts/:postId/comments/:commentId/:postId", protect, deletePostComment);
router.patch("/posts/:postId/comments/:commentId/replies/:replyId/like", protect, likeComment);
router.get("/viral", protect, getViralPosts);
router.patch('/posts/:postId/playlist/:playlistId', protect, addPostToPlaylist);
router.post('/channels/:channelId/block', protect, blockChannel);
router.delete('/posts/:postId/playlist/:playlistId', protect, removePostFromPlaylist);

// Not interested management
router.patch('/posts/:postId/not-interested', protect, toggleNotInterested);

// Channel blocking management
router.delete('/channels/:channelId/block', protect, unblockChannel);
export default router;