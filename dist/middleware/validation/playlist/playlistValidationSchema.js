"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddPlaylistSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.validateAddPlaylistSchema = joi_1.default.object({
    name: joi_1.default.string()
        .min(2)
        .max(30)
        .required()
        .messages({
        'string.base': 'Playlist Name should be a string',
        'string.empty': 'Playlist Name is required',
        'string.min': 'Playlist Name must be at least 2 characters long',
        'string.max': 'Playlist Name must be less than or equal to 30 characters',
    }),
    visibility: joi_1.default.string()
        .valid('private', 'public') // Restrict to 'private' or 'public'
        .required()
        .messages({
        'string.base': 'Visibility should be a string',
        'any.only': 'Visibility must be either "private" or "public"',
        'string.empty': 'Visibility is required',
    }),
});
const validateAddPlaylistRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validateAddPlaylistRequest;
