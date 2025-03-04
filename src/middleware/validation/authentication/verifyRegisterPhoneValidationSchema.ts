import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../../../messages/ErrorResponse";

export const verifyOTpVerificationSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .messages({
      "string.pattern.base": "Phone Number must contain only numbers",
    }),
  type: Joi.string().required().messages({
    "string.base": "Type must be a string",
    "any.required": "Type is required",
  }),
});

const validateVerifyRegisterMobileNumberRequest = (
  schema: Joi.ObjectSchema
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { allowUnknown: true });
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    next();
  };
};

export default validateVerifyRegisterMobileNumberRequest;
