import asyncHandler from "express-async-handler";
import Feed from "../../models/Feed";
import baseResponseHandler from "../../messages/BaseResponseHandler";


// @desc     Add Category to user Feed
// @route   /api/v1/feed/category
// @access  private

// export const createCategoryFeeds = asyncHandler(async (req, res, next) => {

//     const { categories } = req.body;

//     console.log("categories", categories);

//     const categoryFeed = await Feed.create(categories);

//     baseResponseHandler({
//         message: "Category Feed Uploaded Successfully",
//         res,
//         statusCode: 201,
//         success: true,
//         data: categoryFeed,
//     });

// });

export const createCategoryFeeds = asyncHandler(async (req, res, next) => {
    const { categories } = req.body;

    console.log("categories", categories);

    // Find an existing feed document or create a new one
    let categoryFeed = await Feed.findOne();

    if (!categoryFeed) {
        // If no document exists, create a new one
        categoryFeed = new Feed({ categories });
    } else {
        // Merge new categories with existing ones, avoiding duplicates
        categoryFeed.categories = Array.from(new Set([...categoryFeed.categories, ...categories]));
    }

    await categoryFeed.save();

    baseResponseHandler({
        message: "Category Feed Uploaded Successfully",
        res,
        statusCode: 201,
        success: true,
        data: categoryFeed,
    });
});





