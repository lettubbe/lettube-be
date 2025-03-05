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
exports.hashUserPassword = exports.generateResetPasswordToken = exports.comparePassword = exports.otpTokenExpiry = exports.generateReferalCode = exports.generateToken = exports.generateHash = exports.generateVerificationCode = void 0;
exports.generateRandomChar = generateRandomChar;
exports.generatePaymentReference = generatePaymentReference;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 90000).toString();
};
exports.generateVerificationCode = generateVerificationCode;
const generateHash = () => {
    const uniqueInput = `${new Date().getTime()}${Math.random()}`;
    const hash = crypto_1.default.createHash("sha256").update(uniqueInput).digest("hex");
    return hash;
};
exports.generateHash = generateHash;
const generateToken = (id) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const tokenGen = jsonwebtoken_1.default.sign({ id }, JWT_SECRET);
    return tokenGen;
};
exports.generateToken = generateToken;
const generateReferalCode = (firstName, lastName) => {
    firstName.toLowerCase().replace(/\s+/g, "") || "";
    lastName.toLowerCase().replace(/\s+/g, "") || "";
    const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
    return `@${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber}/lettube`;
};
exports.generateReferalCode = generateReferalCode;
const otpTokenExpiry = (time) => {
    return Math.floor(Date.now() / 1000) + time;
};
exports.otpTokenExpiry = otpTokenExpiry;
const comparePassword = (enteredPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.compare(enteredPassword, hashedPassword);
});
exports.comparePassword = comparePassword;
const generateResetPasswordToken = () => {
    return crypto_1.default.randomBytes(20).toString("hex");
};
exports.generateResetPasswordToken = generateResetPasswordToken;
const hashUserPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    yield bcryptjs_1.default.genSalt(10);
    return yield bcryptjs_1.default.hash("password", 10);
});
exports.hashUserPassword = hashUserPassword;
function generateRandomChar(length = 6) {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function generatePaymentReference() {
    const uniqueCode = generateRandomChar(12);
    // Use only allowed characters
    return `LETTUBE-REF-${uniqueCode}`;
}
