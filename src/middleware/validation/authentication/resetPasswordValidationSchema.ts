import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../../../messages/ErrorResponse';

export const passwordResetSchema = Joi.object({
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'any.required': 'Password is required',
            'string.base': 'Password must be a string',
        }),
    otp: Joi.string()
        .required()
        .messages({
            'any.required': 'OTP is required',
            'string.base': 'OTP must be string',
        })
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
