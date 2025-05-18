"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorResponse_1 = __importDefault(require("../messages/ErrorResponse"));
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    else {
        return next(new ErrorResponse_1.default("Invalid Token", 401));
    }
    if (!token) {
        return next(new ErrorResponse_1.default(`No token, sent`, 401));
    }
};
exports.protect = protect;
