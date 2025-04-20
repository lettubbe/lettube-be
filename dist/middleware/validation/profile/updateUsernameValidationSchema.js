"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.updateUserProfileSchema = joi_1.default.object({
    firstName: joi_1.default.string()
        .min(2)
        .max(30)
        .required()
        .messages({
        'string.base': 'First Name should be a string',
        'string.empty': 'First Name is required',
        'string.min': 'First Name must be at least 2 characters long',
        'string.max': 'First Name must be less than or equal to 30 characters',
    }),
    lastName: joi_1.default.string()
        .min(2)
        .max(30)
        .required()
        .messages({
        'string.base': 'Last Name should be a string',
        'string.empty': 'Last Name is required',
        'string.min': 'Last Name must be at least 2 characters long',
        'string.max': 'Last Name must be less than or equal to 30 characters',
    }),
});
const validateUpdateUsernameRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validateUpdateUsernameRequest;
