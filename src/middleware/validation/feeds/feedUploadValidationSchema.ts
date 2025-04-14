import Joi from 'joi';
import ErrorResponse from '../../../messages/ErrorResponse';
import { Request, Response, NextFunction } from 'express';

export const validatePostFeedSchema = Joi.object({
  // tags: Joi.array().items(Joi.string()).optional(), 
  category: Joi.string().required().messages({
    "any.required": "Category is required 1234",
    "string.base": "Password must be a string",
  }),
  description: Joi.string().required().messages({
    "any.required": "Description is required",
    "string.base": "Description must be a string",
  }), 
  visibility: Joi.string().valid('public', 'private', 'friends').required(), 
  isCommentsAllowed: Joi.boolean().required(), // must be true/false
});

const validatePostFeed = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { allowUnknown: true });
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    next();
  };
};

export default validatePostFeed;
