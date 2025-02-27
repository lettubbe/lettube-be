import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../../../messages/ErrorResponse';

export const transactionPinSchema = Joi.object({
    pin: Joi.string()
        .length(4)
        .required()
        .messages({
            'any.required': 'Pin is required',
            'string.length': 'Pin must be exactly 4 characters long',
            'string.base': 'Pin must be a string'
        }),
    confirmPin: Joi.any()
        .valid(Joi.ref('pin'))
        .required()
        .messages({
            'any.only': 'Confirm Pin must match Pin',
            'any.required': 'Confirm Pin is required'
        })
});

const validateTransactionalPinRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };
};

export default validateTransactionalPinRequest;
