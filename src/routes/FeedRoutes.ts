import express from "express";
import { createCategoryFeeds, getContacts } from "../controllers/feed/FeedController";
import { protect } from "../middleware/protect";
import validateAddCategoryFeedRequest, { validateAddCategoryFeedSchema } from "../middleware/validation/feeds/categoryValidationSchema";
import validateGetPhoneContacts, { validatePhoneContactsSchema } from "../middleware/validation/feeds/phoneContactsValidationSchema";

const router = express.Router();

router.post("/category", [validateAddCategoryFeedRequest(validateAddCategoryFeedSchema), protect], createCategoryFeeds);
router.post("/contacts", [validateGetPhoneContacts(validatePhoneContactsSchema), protect], getContacts);

export default router;