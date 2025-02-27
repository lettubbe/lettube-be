import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../../../messages/ErrorResponse';

export const changePinSchema = Joi.object({
    newPin: Joi.string()
        .min(4)
        .required()
        .messages({
            'string.min': 'Pin must be atleast 4 character',
            'any.required': 'New Pin is required',
            'string.base': 'New Pin must be a string',
        }),
    confirmNewPin: Joi.string()
        .valid(Joi.ref('newPin'))
        .required()
        .messages({
            'any.only': 'Confirm Pin must match new Pin',
            'any.required': 'Confirm Pin is required',
            'string.base': 'Confirm Pin must be a string',
        }),
    currentPin: Joi.string()
        .min(4)
        .required()
        .messages({
            'string.min': 'Current Pin must be at least 4 characters long',
            'any.required': 'Current Pin is required',
            'string.base': 'Current Pin must be a string',
        })
});

const validateChangePinRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };
};

export default validateChangePinRequest;
