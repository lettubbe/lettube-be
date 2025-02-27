"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const ErrorResponse_1 = __importDefault(require("../messages/ErrorResponse"));
const notFound = (req, res, next) => {
    const error = new ErrorResponse_1.default(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    // console.log("ERRROR", error);
    if (err.name === "CastError") {
        const message = `Resource not found`;
        error = new ErrorResponse_1.default(message, 404);
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ErrorResponse_1.default(message, 400);
    }
    // // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message);
        console.log(`message Mongoose validation error`, message);
        error = new ErrorResponse_1.default(message, 400);
    }
    const statusCode = error.statusCode || 500;
    const isStandardError = error instanceof ErrorResponse_1.default || err instanceof ErrorResponse_1.default;
    res.status(statusCode).json({
        success: false,
        error: isStandardError ? error.message : "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.default = errorHandler;
