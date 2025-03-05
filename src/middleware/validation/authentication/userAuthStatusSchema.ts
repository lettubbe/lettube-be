import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../../../messages/ErrorResponse";

export const validateUserAuthStatusRequestSchema = Joi.object({
  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email address",
    "string.base": "Email must be a string",
  }),
  phoneNumber: Joi.string()
    .pattern(/^\d{10,15}$/)
    .messages({
      "string.pattern.base": "Phone number must be between 10 to 15 digits",
      "string.base": "Phone number must be a string",
    }),
})
  .or("email", "phoneNumber")
  .messages({
    "object.missing": "Either email or phone number is required",
  });

const validateUserAuthStatusRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query, { allowUnknown: true });
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    next();
  };
};

export default validateUserAuthStatusRequest;
