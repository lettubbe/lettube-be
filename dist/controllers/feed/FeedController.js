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
exports.getContacts = exports.getUserFeeds = exports.createCategoryFeeds = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Feed_1 = __importDefault(require("../../models/Feed"));
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
const utils_1 = require("../../lib/utils/utils");
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const User_1 = __importDefault(require("../../models/User"));
// @desc    Add Category to user Feed
// @route   POST /api/v1/feed/category
// @access  Private
exports.createCategoryFeeds = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categories = [], excludedCategories = [] } = req.body;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    // Find an existing feed document for the user
    let categoryFeed = yield Feed_1.default.findOne({ user: user._id });
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
    yield categoryFeed.save();
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
    (0, BaseResponseHandler_1.default)({
        message: `User Feeds Retrived successfully`,
        res,
        statusCode: 200,
        success: true,
        data: user,
    });
}));
// @desc     Get User Feed
// @route    GET /api/v1/feed/phoneNumbers
// @access   Private
// export const getContacts = asyncHandler(async (req, res, next) => {
//   const { phoneNumbers } = req.body;
//   // Validate that phoneNumbers is an array
//   if (!Array.isArray(phoneNumbers)) {
//     return next(
//       new ErrorResponse("phoneNumbers must be a non-empty array", 400)
//     );
//   }
//   const contacts = await User.find({
//     phoneNumber: { $in: phoneNumbers },
//   }).select("firstName lastName phoneNumber email profilePicture");
//   if (!contacts || contacts.length === 0) {
//     return next(new ErrorResponse("No contacts found", 404));
//   }
//   baseResponseHandler({
//     message: `Contact Retrived Successfully`,
//     res,
//     statusCode: 200,
//     success: true,
//     data: contacts
//   });
// });
exports.getContacts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumbers } = req.body;
    // Validate that phoneNumbers is an array
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
    //   if (!contacts || contacts.length === 0) {
    //     return next(new ErrorResponse("No contacts found", 404));
    //   }
    (0, BaseResponseHandler_1.default)({
        message: "Contacts Retrieved Successfully",
        res,
        statusCode: 200,
        success: true,
        data: contacts || [],
    });
}));
