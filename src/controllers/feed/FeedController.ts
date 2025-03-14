import asyncHandler from "express-async-handler";
import Feed from "../../models/Feed";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import { getAuthUser } from "../../lib/utils/utils";


// @desc    Add Category to user Feed
// @route   GET /api/v1/feed/category
// @access  private

export const createCategoryFeeds = asyncHandler(async (req, res, next) => {
    const { categories } = req.body;

    console.log("categories", categories);

    const user = await getAuthUser(req, next);

    // Find an existing feed document or create a new one
    let categoryFeed = await Feed.findOne();

    if (!categoryFeed) {
        // If no document exists, create a new one
        categoryFeed = new Feed({ categories, user: user._id });
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

// @desc     Get User Feed
// @route   GET /api/v1/feed/
// @access  private

export const getUserFeeds = asyncHandler(async (req, res, next) => {

    const user = await getAuthUser(req, next);

    baseResponseHandler({
        message: `User Feeds Retrived successfully`,
        res,
        statusCode: 200,
        success: true,
        data: user
    });

});

// @desc     Get User Feed
// @route   GET /api/v1/feed/
// @access  private

export const getContacts = asyncHandler(async (req, res, next) => {

});

