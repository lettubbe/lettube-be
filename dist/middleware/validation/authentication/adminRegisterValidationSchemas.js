"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRegisterSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.adminRegisterSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email(),
    inviteId: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string()
        .messages({
        'any.required': 'Phone Number is required'
    }).required(),
    password: joi_1.default.string()
        .required()
        .messages({
        'any.required': 'Password is required'
    }).required()
});
const validateAdminRegisterRequest = (req, res, next) => {
    const { error } = exports.adminRegisterSchema.validate(req.body, { allowUnknown: true });
    if (error) {
        return next(new ErrorResponse_1.default(error.details[0].message, 400));
    }
    next();
};
exports.default = validateAdminRegisterRequest;
