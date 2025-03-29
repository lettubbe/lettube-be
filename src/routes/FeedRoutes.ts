import express from "express";
import { protect } from "../middleware/protect";
import validateGetPhoneContacts, { validatePhoneContactsSchema } from "../middleware/validation/feeds/phoneContactsValidationSchema";
import validateAddCategoryFeedRequest, { validateAddCategoryFeedSchema } from "../middleware/validation/feeds/categoryValidationSchema";
import { createCategoryFeeds, getContacts, getUserFeeds, getUserUploadedFeeds, uploadFeedPost } from "../controllers/feed/FeedController";

const router = express.Router();

router.post("/category", [validateAddCategoryFeedRequest(validateAddCategoryFeedSchema), protect], createCategoryFeeds);
router.post("/contacts", [validateGetPhoneContacts(validatePhoneContactsSchema), protect], getContacts);
router.get("/", protect, getUserFeeds);
router.get("/uploads", protect, getUserUploadedFeeds);
router.post("/upload", protect, uploadFeedPost);


export default router;