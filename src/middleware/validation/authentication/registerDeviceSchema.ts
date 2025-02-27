import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../../../messages/ErrorResponse';

export const registerDeviceSchema = Joi.object({
    deviceId: Joi.string().required(),
    token: Joi.string().required(),
    platform: Joi.string().required(),
    deviceName:  Joi.string().required(),


});

const validateRegisterDeviceRequest =  (req: Request, res: Response, next: NextFunction) => {
        const { error } = registerDeviceSchema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };

export default validateRegisterDeviceRequest;
