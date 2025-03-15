import Joi from 'joi';
import ErrorResponse from '../../../messages/ErrorResponse';
import { Request, Response, NextFunction } from 'express';

export const validateAddCategoryFeedSchema = Joi.object({
    categories: Joi.array().items(Joi.string()).optional(),
    excludedCategories: Joi.array().items(Joi.string()).optional(),
}).xor('categories', 'excludedCategories'); // Ensure at least one is provided

const validateAddCategoryFeedRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ErrorResponse(error.details[0].message, 400));
        }
        next();
    };
};

export default validateAddCategoryFeedRequest;
