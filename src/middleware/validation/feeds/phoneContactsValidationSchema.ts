import Joi from 'joi';
import ErrorResponse from '../../../messages/ErrorResponse';
import { Request, Response, NextFunction } from 'express';

export const validatePhoneContactsSchema = Joi.object({
    phoneNumbers: Joi.array().items(Joi.string()).required()
});

const validateGetPhoneContacts = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };
};

export default validateGetPhoneContacts;
