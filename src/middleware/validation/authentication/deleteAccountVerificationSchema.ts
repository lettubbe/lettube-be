import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../../../messages/ErrorResponse';

export const validateDeleteAccountRequestSchema = Joi.object({
    password: Joi.string()
        .required().min(6)
        .messages({
            'any.required': 'Password is required',
            'string.length': 'Password must be atleast six characters',
        })
});

const validateDeleteAccountRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };
};

export default validateDeleteAccountRequest;

