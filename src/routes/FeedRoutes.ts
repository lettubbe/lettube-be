import express from "express";
import { protect } from "../middleware/protect";
import validateGetPhoneContacts, { validatePhoneContactsSchema } from "../middleware/validation/feeds/phoneContactsValidationSchema";
import validateAddCategoryFeedRequest, { validateAddCategoryFeedSchema } from "../middleware/validation/feeds/categoryValidationSchema";
import { commentOnPost, createCategoryFeeds, dislikePost, getContacts, getUserFeeds, getUserUploadedFeeds, likeComment, likePost, replyToComment, uploadFeedPost } from "../controllers/feed/FeedController";
import validatePostFeed, { validatePostFeedSchema } from "../middleware/validation/feeds/feedUploadValidationSchema";
import upload from "../middleware/multer";

const router = express.Router();

// validatePostFeed(validatePostFeedSchema),

router.post("/category", [validateAddCategoryFeedRequest(validateAddCategoryFeedSchema), protect], createCategoryFeeds);
router.post("/contacts", [validateGetPhoneContacts(validatePhoneContactsSchema), protect], getContacts);
router.get("/", protect, getUserFeeds);
router.get("/uploads", protect, getUserUploadedFeeds);
router.post("/upload", [protect, upload.fields([{ name: "thumbnailImage" }, {name: "postVideo" }])], uploadFeedPost);

router.post("/posts/:postId/like", protect, likePost);
router.post("/posts/:postId/dislike", protect, dislikePost);
router.post("/posts/:postId/comments", protect, commentOnPost);
router.post("/posts/:postId/comments/:commentId/replies", protect, replyToComment);
router.post("/posts/:postId/comments/:commentId/like", protect, likeComment);
router.post("/posts/:postId/comments/:commentId/replies/:replyId/like", protect, likeComment);



export default router;