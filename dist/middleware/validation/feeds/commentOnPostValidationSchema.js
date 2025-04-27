"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePostCommentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.validatePostCommentSchema = joi_1.default.object({
    text: joi_1.default.string()
        .trim()
        .required()
        .messages({
        'string.base': 'Comment text must be a string',
        'string.empty': 'Comment text cannot be empty',
        'any.required': 'Comment text is required',
    })
});
const validatePostComment = (schema) => {
    return (req, res, next) => {
        console.log("post commet validation");
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validatePostComment;
