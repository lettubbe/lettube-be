"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionPinSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.transactionPinSchema = joi_1.default.object({
    pin: joi_1.default.string()
        .length(4)
        .required()
        .messages({
        'any.required': 'Pin is required',
        'string.length': 'Pin must be exactly 4 characters long',
        'string.base': 'Pin must be a string'
    }),
    confirmPin: joi_1.default.any()
        .valid(joi_1.default.ref('pin'))
        .required()
        .messages({
        'any.only': 'Confirm Pin must match Pin',
        'any.required': 'Confirm Pin is required'
    })
});
const validateTransactionalPinRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validateTransactionalPinRequest;
