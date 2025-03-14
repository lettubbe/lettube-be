import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../../../messages/ErrorResponse";

export const passwordResetSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(/[\d]/)
    .pattern(/[!@#$%^&*(),.?":{}|<>]/)
    .required()
    .messages({
      "any.required": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one number and one special character",
      "string.base": "Password must be a string",
    }),
  token: Joi.string().required().messages({
    "any.required": "OTP is required",
    "string.base": "OTP must be string",
  }),
})
  .or("email", "phoneNumber") // Ensure at least one is provided
  .messages({
    "object.missing": "Either email or phone number is required",
  });

const validatePasswordResetRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { allowUnknown: true });
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    next();
  };
};

export default validatePasswordResetRequest;
