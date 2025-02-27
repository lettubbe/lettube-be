"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePinSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.changePinSchema = joi_1.default.object({
    newPin: joi_1.default.string()
        .min(4)
        .required()
        .messages({
        'string.min': 'Pin must be atleast 4 character',
        'any.required': 'New Pin is required',
        'string.base': 'New Pin must be a string',
    }),
    confirmNewPin: joi_1.default.string()
        .valid(joi_1.default.ref('newPin'))
        .required()
        .messages({
        'any.only': 'Confirm Pin must match new Pin',
        'any.required': 'Confirm Pin is required',
        'string.base': 'Confirm Pin must be a string',
    }),
    currentPin: joi_1.default.string()
        .min(4)
        .required()
        .messages({
        'string.min': 'Current Pin must be at least 4 characters long',
        'any.required': 'Current Pin is required',
        'string.base': 'Current Pin must be a string',
    })
});
const validateChangePinRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validateChangePinRequest;
