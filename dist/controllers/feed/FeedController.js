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
exports.createCategoryFeeds = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Feed_1 = __importDefault(require("../../models/Feed"));
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
// @desc     Add Category to user Feed
// @route   /api/v1/feed/category
// @access  private
// export const createCategoryFeeds = asyncHandler(async (req, res, next) => {
//     const { categories } = req.body;
//     console.log("categories", categories);
//     const categoryFeed = await Feed.create(categories);
//     baseResponseHandler({
//         message: "Category Feed Uploaded Successfully",
//         res,
//         statusCode: 201,
//         success: true,
//         data: categoryFeed,
//     });
// });
exports.createCategoryFeeds = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categories } = req.body;
    console.log("categories", categories);
    // Find an existing feed document or create a new one
    let categoryFeed = yield Feed_1.default.findOne();
    if (!categoryFeed) {
        // If no document exists, create a new one
        categoryFeed = new Feed_1.default({ categories });
    }
    else {
        // Merge new categories with existing ones, avoiding duplicates
        categoryFeed.categories = Array.from(new Set([...categoryFeed.categories, ...categories]));
    }
    yield categoryFeed.save();
    (0, BaseResponseHandler_1.default)({
        message: "Category Feed Uploaded Successfully",
        res,
        statusCode: 201,
        success: true,
        data: categoryFeed,
    });
}));
