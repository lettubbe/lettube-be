import asyncHandler from "express-async-handler";
import Category from "../../models/Category";
import { getPaginateOptions } from "../../lib/utils/paginate";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import { CATEGORIES } from "../../_data/categories";


// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public

export const getCategories = asyncHandler(async (req, res, next) => {

    const { limit, page  } = req.query;

    const options = getPaginateOptions(page, limit);  

    // const Categories = await Category.paginate({}, options);

    const categories = CATEGORIES;

    baseResponseHandler({
        res,
        statusCode: 200,
        data: categories,
        message: "Categories fetched successfully",
        success: true
    });

});