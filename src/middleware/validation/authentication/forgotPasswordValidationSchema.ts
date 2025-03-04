import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../../../messages/ErrorResponse";

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  phoneNumber: Joi.string().messages({
    "any.required": "Phone Number is required",
  }),
  type: Joi.string().required().messages({
    "string.base": "Type must be a string",
    "any.required": "Type is required",
  }),
})
  .xor("email", "phoneNumber")
  .messages({
    "object.missing": "Either email or phone number must be provided.",
  });

const validateForgotPasswordRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { allowUnknown: true });
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    next();
  };
};

export default validateForgotPasswordRequest;
