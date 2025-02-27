import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../../../messages/ErrorResponse';

export const verifyOTpVerificationSchema = Joi.object({
    email: Joi.string()
        .email()
        .messages({
            'string.email': 'Email must be a valid email address',
            'string.base': 'Email must be a string',
        }),
    phoneNumber: Joi.string()
        .pattern(/^[0-9]+$/)
        .messages({
            'string.pattern.base': 'Phone Number must contain only numbers',
        }),
}).xor('email', 'phoneNumber')
    .messages({
        'object.xor': 'Either email or phone number must be provided, but not both.'
    });

const validateVerifyOTPRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };
};

export default validateVerifyOTPRequest;
