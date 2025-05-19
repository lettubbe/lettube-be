"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPushToken = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Devices_1 = __importDefault(require("../../models/Auth/Devices"));
const utils_1 = require("../../lib/utils/utils");
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
// @desc     Add User Push Token
// @route    GET /api/v1/notifications/device/pushToken
// @access   Private
exports.getUserPushToken = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hitting push token", req.params);
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const { deviceToken } = req.params;
    const deviceExists = yield Devices_1.default.findOne({ userId: user._id });
    if (deviceExists) {
        if (deviceExists.deviceToken !== deviceToken) {
            deviceExists.deviceToken = deviceToken;
            yield deviceExists.save();
        }
        return;
    }
    const _device = yield Devices_1.default.create({ deviceToken, userId: user._id });
    (0, BaseResponseHandler_1.default)({
        message: `Device Token Saved Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: _device,
    });
}));
