"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.changePasswordSchema = joi_1.default.object({
    newPassword: joi_1.default.string()
        .min(6)
        .pattern(new RegExp('^[a-zA-Z0-9]+$'))
        .required()
        .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.pattern.base': 'Password must contain only alphanumeric characters',
        'any.required': 'New Password is required',
        'string.base': 'New Password must be a string',
    }),
    confirmNewPassword: joi_1.default.string()
        .valid(joi_1.default.ref('newPassword'))
        .required()
        .messages({
        'any.only': 'Confirm password must match new password',
        'any.required': 'Confirm Password is required',
        'string.base': 'Confirm Password must be a string',
    }),
    currentPassword: joi_1.default.string()
        .min(6)
        .pattern(new RegExp('^[a-zA-Z0-9]+$'))
        .required()
        .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.pattern.base': 'Password must contain only alphanumeric characters',
        'any.required': 'Current Password is required',
        'string.base': 'Current Password must be a string',
    })
});
const validateChangePasswordRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validateChangePasswordRequest;
