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
exports.buildUserAuthTypeQuery = exports.removeSensitiveFields = exports.formatCurrency = exports.getAuthUser = void 0;
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
const formatCurrency = (amount) => {
    return `NGN${amount.toLocaleString("en-NG")}`;
};
exports.formatCurrency = formatCurrency;
const removeSensitiveFields = (user, fields = ["password"]) => {
    const userData = Object.assign({}, user.toObject());
    fields.forEach((field) => delete userData[field]);
    return userData;
};
exports.removeSensitiveFields = removeSensitiveFields;
const buildUserAuthTypeQuery = (email, phoneNumber) => {
    const query = {};
    if (email)
        query.email = email.toLowerCase();
    if (phoneNumber)
        query.phoneNumber = phoneNumber;
    return query;
};
exports.buildUserAuthTypeQuery = buildUserAuthTypeQuery;
