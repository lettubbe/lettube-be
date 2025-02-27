"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env = process.env.NODE_ENV;
const config = {
    env,
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    mailJet: {
        apiKey: process.env.MAILJET_API_KEY,
        apiSecret: process.env.MAILJET_API_SECRET,
    },
    mongodb: {
        mongoUri: process.env.MONGO_URI,
    },
    auth: {
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
        jwtSecret: process.env.JWT_SECRET
    }
};
exports.default = config;
