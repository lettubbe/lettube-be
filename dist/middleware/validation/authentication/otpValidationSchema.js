"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPVerificationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.OTPVerificationSchema = joi_1.default.object({
    otp: joi_1.default.string()
        .required()
        .messages({
        'any.required': 'OTP is required',
        'string.length': 'OTP must be exactly 4 characters long',
        'string.base': 'OTP must be a string'
    })
});
const validateOTPRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validateOTPRequest;
