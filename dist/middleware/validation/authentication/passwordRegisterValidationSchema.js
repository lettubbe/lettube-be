"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRegisterVerificationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.passwordRegisterVerificationSchema = joi_1.default.object({
    password: joi_1.default.string()
        .min(8)
        .pattern(/[\d]/)
        .pattern(/[!@#$%^&*(),.?":{}|<>]/)
        .required()
        .messages({
        "any.required": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base": "Password must contain at least one number and one special character",
        "string.base": "Password must be a string",
    }),
    email: joi_1.default.string().email().messages({
        "string.email": "Email must be a valid email address",
        "string.base": "Email must be a string",
    }),
    phoneNumber: joi_1.default.string()
        .pattern(/^\d{10,15}$/)
        .messages({
        "string.pattern.base": "Phone number must be between 10 to 15 digits",
        "string.base": "Phone number must be a string",
    }),
})
    .or("email", "phone") // Ensure at least one is provided
    .messages({
    "object.missing": "Either email or phone number is required",
});
const validatePasswordRegisterRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validatePasswordRegisterRequest;
