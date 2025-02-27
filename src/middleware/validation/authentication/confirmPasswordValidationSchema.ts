import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../../../messages/ErrorResponse';

export const changePasswordSchema = Joi.object({
    newPassword: Joi.string()
        .min(6)
        .pattern(new RegExp('^[a-zA-Z0-9]+$'))
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.pattern.base': 'Password must contain only alphanumeric characters',
            'any.required': 'New Password is required',
            'string.base': 'New Password must be a string',
        }),
    confirmNewPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Confirm password must match new password',
            'any.required': 'Confirm Password is required',
            'string.base': 'Confirm Password must be a string',
        }),
    currentPassword: Joi.string()
        .min(6)
        .pattern(new RegExp('^[a-zA-Z0-9]+$'))
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.pattern.base': 'Password must contain only alphanumeric characters',
            'any.required': 'Current Password is required',
            'string.base': 'Current Password must be a string',
        })
});

const validateChangePasswordRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };
};

export default validateChangePasswordRequest;
