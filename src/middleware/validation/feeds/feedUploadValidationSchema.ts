import Joi from 'joi';
import ErrorResponse from '../../../messages/ErrorResponse';
import { Request, Response, NextFunction } from 'express';

export const validatePostFeedSchema = Joi.object({
  // tags: Joi.array().items(Joi.string()), 
  // category: Joi.string().required().messages({
  //   "any.required": "Category is required",
  //   "string.base": "Category must be a string",
  // }),
  description: Joi.string().required().messages({
    "any.required": "Description is required",
    "string.base": "Description must be a string",
  }), 
  visibility: Joi.string().valid('public', 'private', 'friends').required(), 
  isCommentsAllowed: Joi.boolean().required(), 
});

const validatePostFeed = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {

    
    const { error } = schema.validate(req.body, { allowUnknown: true });

    console.log("first", error?.details[0].message);

    // console.log("validate post field error", {error, body: req.body});

    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    next();
  };
};

export default validatePostFeed;
