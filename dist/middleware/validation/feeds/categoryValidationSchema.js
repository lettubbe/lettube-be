"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddCategoryFeedSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.validateAddCategoryFeedSchema = joi_1.default.object({
    categories: joi_1.default.array().items(joi_1.default.string()).optional(),
    excludedCategories: joi_1.default.array().items(joi_1.default.string()).optional(),
}).xor('categories', 'excludedCategories'); // Ensure at least one is provided
const validateAddCategoryFeedRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validateAddCategoryFeedRequest;
