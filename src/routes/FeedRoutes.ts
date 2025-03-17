import express from "express";
import { createCategoryFeeds, getContacts, getUserFeeds, getUserUploadedFeeds } from "../controllers/feed/FeedController";
import { protect } from "../middleware/protect";
import validateAddCategoryFeedRequest, { validateAddCategoryFeedSchema } from "../middleware/validation/feeds/categoryValidationSchema";
import validateGetPhoneContacts, { validatePhoneContactsSchema } from "../middleware/validation/feeds/phoneContactsValidationSchema";

const router = express.Router();

router.post("/category", [validateAddCategoryFeedRequest(validateAddCategoryFeedSchema), protect], createCategoryFeeds);
router.post("/contacts", [validateGetPhoneContacts(validatePhoneContactsSchema), protect], getContacts);
router.get("/", protect, getUserFeeds);
router.get("/uploads", protect, getUserUploadedFeeds);


export default router;