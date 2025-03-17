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
exports.getCategories = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const paginate_1 = require("../../lib/utils/paginate");
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
const categories_1 = require("../../_data/categories");
// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page } = req.query;
    const options = (0, paginate_1.getPaginateOptions)(page, limit);
    const categoryData = (0, paginate_1.transformPaginateResponse)([]);
    // const Categories = await Category.paginate({}, options);
    const categories = categories_1.CATEGORIES;
    (0, BaseResponseHandler_1.default)({
        res,
        statusCode: 200,
        data: categories,
        message: "Categories fetched successfully",
        success: true
    });
}));
