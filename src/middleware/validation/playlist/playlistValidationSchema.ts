import Joi from 'joi';
import ErrorResponse from '../../../messages/ErrorResponse';
import { Request, Response, NextFunction } from 'express';

export const validateAddPlaylistSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(30)
        .required()
        .messages({
            'string.base': 'Playlist Name should be a string',
            'string.empty': 'Playlist Name is required',
            'string.min': 'Playlist Name must be at least 2 characters long',
            'string.max': 'Playlist Name must be less than or equal to 30 characters',
        }),
    
    visibility: Joi.string()
        .valid('private', 'public')  // Restrict to 'private' or 'public'
        .required()
        .messages({
            'string.base': 'Visibility should be a string',
            'any.only': 'Visibility must be either "private" or "public"',
            'string.empty': 'Visibility is required',
        }),
});


const validateAddPlaylistRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };
};

export default validateAddPlaylistRequest;