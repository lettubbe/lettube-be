"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePostFeedSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.validatePostFeedSchema = joi_1.default.object({
    // tags: Joi.array().items(Joi.string()), 
    // category: Joi.string().required().messages({
    //   "any.required": "Category is required",
    //   "string.base": "Category must be a string",
    // }),
    description: joi_1.default.string().required().messages({
        "any.required": "Description is required",
        "string.base": "Description must be a string",
    }),
    visibility: joi_1.default.string().valid('public', 'private', 'friends').required(),
    isCommentsAllowed: joi_1.default.boolean().required(),
});
const validatePostFeed = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        console.log("first", error === null || error === void 0 ? void 0 : error.details[0].message);
        // console.log("validate post field error", {error, body: req.body});
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validatePostFeed;
