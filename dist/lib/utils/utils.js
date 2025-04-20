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
exports.normalizePhoneNumber = exports.buildUserAuthTypeQuery = exports.removeSensitiveFields = exports.formatCurrency = exports.getAuthUser = void 0;
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const User_1 = __importDefault(require("../../models/User"));
const getAuthUser = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    console.log("user", req.user);
    if (!userId) {
        return next(new ErrorResponse_1.default(`User Id is required`, 400));
    }
    const user = yield User_1.default.findOne({ _id: userId });
    console.log("logged in user", user);
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
const buildUserAuthTypeQuery = (email, phoneNumber, userId) => {
    const query = {};
    if (email)
        query.email = email.toLowerCase();
    if (phoneNumber)
        query.phoneNumber = phoneNumber;
    if (userId)
        query._id = userId;
    return query;
};
exports.buildUserAuthTypeQuery = buildUserAuthTypeQuery;
const normalizePhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/\D/g, '').slice(-10);
};
exports.normalizePhoneNumber = normalizePhoneNumber;
// function assignDefinedFields<T>(target: T, updates: Partial<T>) {
//   for (const key in updates) {
//     if (updates[key as keyof T] !== undefined) {
//       target[key as keyof T] = updates[key as keyof T]!;
//     }
//   }
// }
// assignDefinedFields(user, { firstName, lastName, dob, age, username });
