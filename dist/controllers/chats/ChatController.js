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
exports.deleteChatMessage = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Conversations_1 = require("../../models/chats/Conversations");
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
exports.deleteChatMessage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    // Check if messageId is provided
    if (!messageId) {
        return next(new ErrorResponse_1.default(`Message id is required`, 404));
    }
    // Find and update the message
    const message = yield Conversations_1.Message.findByIdAndUpdate(messageId, { isDeleted: true }, { new: true });
    // Check if message exists
    if (!message) {
        return next(new ErrorResponse_1.default(`Message is required`, 404));
    }
    (0, BaseResponseHandler_1.default)({
        message: `Message deleted successfully`,
        res,
        statusCode: 201,
        success: true,
        data: message
    });
}));
