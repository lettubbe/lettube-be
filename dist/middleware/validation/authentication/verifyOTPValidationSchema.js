"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTpVerificationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.verifyOTpVerificationSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .messages({
        'string.email': 'Email must be a valid email address',
        'string.base': 'Email must be a string',
    }),
    phoneNumber: joi_1.default.string()
        .pattern(/^[0-9]+$/)
        .messages({
        'string.pattern.base': 'Phone Number must contain only numbers',
    }),
}).xor('email', 'phoneNumber')
    .messages({
    'object.xor': 'Either email or phone number must be provided, but not both.'
});
const validateVerifyOTPRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validateVerifyOTPRequest;
