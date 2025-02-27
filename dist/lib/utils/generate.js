"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.generateHash = exports.generateVerificationCode = void 0;
exports.generateRandomChar = generateRandomChar;
exports.generatePaymentReference = generatePaymentReference;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
exports.generateVerificationCode = generateVerificationCode;
const generateHash = () => {
    const uniqueInput = `${new Date().getTime()}${Math.random()}`;
    const hash = crypto_1.default.createHash('sha256').update(uniqueInput).digest('hex');
    return hash;
};
exports.generateHash = generateHash;
const generateToken = (id) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const tokenGen = jsonwebtoken_1.default.sign({ id }, JWT_SECRET);
    return tokenGen;
};
exports.generateToken = generateToken;
// export function generateRandomChar(length: number = 6) {
//   const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
//   let result = '';
//   const charactersLength = characters.length;
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }
// export function generatePaymentReference() {
//   const uniqueCode = generateRandomChar(12);
//   return `ECORIDE_REF_${uniqueCode}`
// }
function generateRandomChar(length = 6) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function generatePaymentReference() {
    const uniqueCode = generateRandomChar(12);
    // Use only allowed characters
    return `ECORIDE-REF-${uniqueCode}`;
}
