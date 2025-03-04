"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDetailsVerificationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.userDetailsVerificationSchema = joi_1.default.object({
    email: joi_1.default.string().required().email().messages({
        "string.email": "Email must be a valid email address",
        "string.base": "Email must be a string",
        "any.required": "Email is required",
    }),
});
const validateuserDetailsRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validateuserDetailsRequest;
