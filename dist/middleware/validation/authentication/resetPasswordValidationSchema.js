"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.passwordResetSchema = joi_1.default.object({
    password: joi_1.default.string()
        .min(6)
        .required()
        .messages({
        'any.required': 'Password is required',
        'string.base': 'Password must be a string',
    }),
    otp: joi_1.default.string()
        .required()
        .messages({
        'any.required': 'OTP is required',
        'string.base': 'OTP must be string',
    })
});
const validatePasswordResetRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validatePasswordResetRequest;
