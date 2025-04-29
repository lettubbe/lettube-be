import express from "express";
import { protect } from "../middleware/protect";
import validateGetPhoneContacts, { validatePhoneContactsSchema } from "../middleware/validation/feeds/phoneContactsValidationSchema";
import validateAddCategoryFeedRequest, { validateAddCategoryFeedSchema } from "../middleware/validation/feeds/categoryValidationSchema";
import { bookmarkPost, commentOnPost, createCategoryFeeds, dislikePost, getContacts, getPostComments, getUserFeeds, getUserPublicUploadedFeeds, getUserUploadedFeeds, likeComment, likePost, replyToComment, uploadFeedPost } from "../controllers/feed/FeedController";
import upload from "../middleware/multer";
import validatePostComment, { validatePostCommentSchema } from "../middleware/validation/feeds/commentOnPostValidationSchema";

const router = express.Router();

// validatePostFeed(validatePostFeedSchema),

router.post("/category", [validateAddCategoryFeedRequest(validateAddCategoryFeedSchema), protect], createCategoryFeeds);
router.post("/contacts", [validateGetPhoneContacts(validatePhoneContactsSchema), protect], getContacts);
router.get("/", protect, getUserFeeds);
router.get("/uploads", protect, getUserUploadedFeeds);
router.get("/uploads/public", protect, getUserPublicUploadedFeeds);
router.post("/upload", [protect, upload.fields([{ name: "thumbnailImage" }, {name: "postVideo" }])], uploadFeedPost);

router.patch("/posts/:postId/like", protect, likePost);
router.patch("/posts/:postId/dislike", protect, dislikePost);
router.get("/posts/:postId/comments", protect, getPostComments);
router.get("/posts/:postId/bookmark", protect, bookmarkPost);
router.patch("/posts/:postId/comments", [protect, validatePostComment(validatePostCommentSchema)], commentOnPost);
router.patch("/posts/:postId/comments/:commentId/replies", protect, replyToComment);
router.patch("/posts/:postId/comments/:commentId/like", protect, likeComment);
router.patch("/posts/:postId/comments/:commentId/replies/:replyId/like", protect, likeComment);



export default router;