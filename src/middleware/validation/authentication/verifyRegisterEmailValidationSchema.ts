import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../../../messages/ErrorResponse";

export const verifyAuthenticationTypeSchema = Joi.object({
  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email address",
    "string.base": "Email must be a string",
  }),
  type: Joi.string().required().messages({
    "string.base": "Type must be a string",
    "any.required": "Type is required",
  }),
})
  .or("email", "phoneNumber")
  .messages({
    "object.missing": "Either email or phone number is required",
  });

const validateVerifyAuthenticationRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { allowUnknown: true });
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    next();
  };
};

export default validateVerifyAuthenticationRequest;
