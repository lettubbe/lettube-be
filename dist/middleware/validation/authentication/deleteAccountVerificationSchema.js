"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeleteAccountRequestSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.validateDeleteAccountRequestSchema = joi_1.default.object({
    password: joi_1.default.string()
        .required().min(6)
        .messages({
        'any.required': 'Password is required',
        'string.length': 'Password must be atleast six characters',
    })
});
const validateDeleteAccountRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validateDeleteAccountRequest;
