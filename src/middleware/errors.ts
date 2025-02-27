import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../messages/ErrorResponse";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorResponse(`Not Found - ${req.originalUrl}`, 404);

  next(error);
}


const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };

  error.message = err.message;

  // console.log("ERRROR", error);

  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val: any) => val.message);
    console.log(`message Mongoose validation error`, message);
    error = new ErrorResponse(message, 400);
  }

  const statusCode = error.statusCode || 500;

  const isStandardError = error instanceof ErrorResponse || err instanceof ErrorResponse;

  res.status(statusCode).json({
    success: false,
    error: isStandardError ? error.message : "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export default errorHandler;