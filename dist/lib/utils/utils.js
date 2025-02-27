"use strict";
/**
 * Get the authenticated user based on their ID.
 * @param {string} userId - The ID of the user to find.
 * @returns {Promise<[Object]>} - Returns an array with the user object.
 * @throws Will throw an error if the user is not found.
 */
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
exports.formatCurrency = exports.getDeviceToken = exports.getAuthUser = void 0;
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const User_1 = __importDefault(require("../../models/User"));
const getAuthUser = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    if (!userId) {
        return next(new ErrorResponse_1.default(`User Id is required`, 400));
    }
    const user = yield User_1.default.findOne({ _id: userId });
    if (!user) {
        return next(new ErrorResponse_1.default(`User Id is required`, 400));
    }
    return user;
});
exports.getAuthUser = getAuthUser;
const getDeviceToken = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    const device = req.deviceToken;
    if (!device) {
        return next(new ErrorResponse_1.default(`Please Enable Ecoride to send you push notifications`, 400));
    }
});
exports.getDeviceToken = getDeviceToken;
const formatCurrency = (amount) => {
    return `NGN${amount.toLocaleString("en-NG")}`;
};
exports.formatCurrency = formatCurrency;
