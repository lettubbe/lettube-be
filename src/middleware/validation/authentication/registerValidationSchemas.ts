import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../../../messages/ErrorResponse';

export const registerUserSchema = Joi.object({
    firstName: Joi.string().required().messages({
        'any.string': 'First Name Must be a string',
        'any.required': 'First Name is required'
    }),
    lastName: Joi.string().required().messages({
        'any.string': 'Last Name Must be a string',
        'any.required': 'Last Name is required'
    }),
    email: Joi.string().email().required().messages({
        'any.string': 'Email Must be a string',
        'any.required': 'Email is required'
    }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'any.required': 'Password is required'
        }),
    phoneNumber: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.min': 'Phone Number must be at least 11 characters long',
            'any.required': 'Phone Number is required'
        }),
    gender: Joi.string()
        .required()
        .messages({
            'any.string': 'Gender Must Be string',
            'any.required': 'Gender is required'
        }),
});

const validateRegisterRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };
};

export default validateRegisterRequest;
