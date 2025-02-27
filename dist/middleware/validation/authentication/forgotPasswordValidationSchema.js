"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    phoneNumber: joi_1.default.string()
        .messages({
        'any.required': 'Phone Number is required'
    })
}).xor('email', 'phoneNumber')
    .messages({
    'object.missing': 'Either email or phone number must be provided.'
});
const validateForgotPasswordRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validateForgotPasswordRequest;
