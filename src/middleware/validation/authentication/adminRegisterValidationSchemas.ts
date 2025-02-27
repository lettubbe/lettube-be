import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../../../messages/ErrorResponse';


export const adminRegisterSchema = Joi.object({
    email: Joi.string()
        .email(),
    inviteId: Joi.string().required(),
    phoneNumber: Joi.string()
        .messages({
            'any.required': 'Phone Number is required'
        }).required(),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        }).required()
});

const validateAdminRegisterRequest =  (req: Request, res: Response, next: NextFunction) => {
        const { error } = adminRegisterSchema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };


export default validateAdminRegisterRequest;
