import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../../../messages/ErrorResponse';

export const OTPVerificationSchema = Joi.object({
        otp: Joi.string()
        .required()
        .messages({
            'any.required': 'OTP is required',
            'string.length': 'OTP must be exactly 4 characters long',
            'string.base': 'OTP must be a string'
        })
});

const validateOTPRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };
};

export default validateOTPRequest;
