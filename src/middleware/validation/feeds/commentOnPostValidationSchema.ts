import Joi from 'joi';
import ErrorResponse from '../../../messages/ErrorResponse';
import { Request, Response, NextFunction } from 'express';

export const validatePostCommentSchema = Joi.object({
    text: Joi.string()
    .trim()
    .required()
    .messages({
        'string.base': 'Comment text must be a string',
        'string.empty': 'Comment text cannot be empty',
        'any.required': 'Comment text is required',
    })
});

const validatePostComment = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log("post commet validation")
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };
};

export default validatePostComment;

