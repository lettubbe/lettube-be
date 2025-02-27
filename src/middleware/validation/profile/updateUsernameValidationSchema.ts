import Joi from 'joi';
import ErrorResponse from '../../../messages/ErrorResponse';
import { Request, Response, NextFunction } from 'express';

export const updateUserProfileSchema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(30)
        .required()
        .messages({
            'string.base': 'First Name should be a string',
            'string.empty': 'First Name is required',
            'string.min': 'First Name must be at least 2 characters long',
            'string.max': 'First Name must be less than or equal to 30 characters',
        }),
    lastName: Joi.string()
        .min(2)
        .max(30)
        .required()
        .messages({
            'string.base': 'Last Name should be a string',
            'string.empty': 'Last Name is required',
            'string.min': 'Last Name must be at least 2 characters long',
            'string.max': 'Last Name must be less than or equal to 30 characters',
        }),
});

const validateUpdateUsernameRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };
};

export default validateUpdateUsernameRequest;
