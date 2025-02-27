"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDeviceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.registerDeviceSchema = joi_1.default.object({
    deviceId: joi_1.default.string().required(),
    token: joi_1.default.string().required(),
    platform: joi_1.default.string().required(),
    deviceName: joi_1.default.string().required(),
});
const validateRegisterDeviceRequest = (req, res, next) => {
    const { error } = exports.registerDeviceSchema.validate(req.body, { allowUnknown: true });
    if (error) {
        return next(new ErrorResponse_1.default(error.details[0].message, 400));
    }
    next();
};
exports.default = validateRegisterDeviceRequest;
