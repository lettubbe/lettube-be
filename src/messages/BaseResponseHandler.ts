import { Response } from "express";

interface BaseResponse {
  res: Response;
  statusCode: number;
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

const baseResponseHandler = ({ res, statusCode, success, message, data = null }: BaseResponse) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data && { data }), 
  });
};

export default baseResponseHandler;