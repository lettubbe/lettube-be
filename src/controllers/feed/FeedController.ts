import asyncHandler from "express-async-handler";
import Feed from "../../models/Feed";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import { getAuthUser, normalizePhoneNumber } from "../../lib/utils/utils";
import ErrorResponse from "../../messages/ErrorResponse";
import User from "../../models/User";

// @desc    Add Category to user Feed
// @route   POST /api/v1/feed/category
// @access  Private

export const createCategoryFeeds = asyncHandler(async (req, res, next) => {
  const { categories = [], excludedCategories = [] } = req.body;

  const user = await getAuthUser(req, next);

  // Find an existing feed document for the user
  let categoryFeed = await Feed.findOne({ user: user._id });

  if (!categoryFeed) {
    // If no document exists, create a new one
    categoryFeed = new Feed({
      user: user._id,
      categories,
      excludedCategories,
    });
  } else {
    // Merge new categories while ensuring uniqueness
    const updatedCategories = Array.from(
      new Set([...categoryFeed.categories, ...categories])
    );
    const updatedExcludedCategories = Array.from(
      new Set([...categoryFeed.excludedCategories, ...excludedCategories])
    );

    // Ensure no category is both included and excluded
    categoryFeed.categories = updatedCategories.filter(
      (cat) => !updatedExcludedCategories.includes(cat)
    );
    categoryFeed.excludedCategories = updatedExcludedCategories.filter(
      (cat) => !updatedCategories.includes(cat)
    );
  }

  await categoryFeed.save();

  baseResponseHandler({
    message: "Category Feed Updated Successfully",
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
    data: user,
  });
});

// @desc     Get User Feed
// @route    GET /api/v1/feed/phoneNumbers
// @access   Private

// export const getContacts = asyncHandler(async (req, res, next) => {
//   const { phoneNumbers } = req.body;

//   // Validate that phoneNumbers is an array
//   if (!Array.isArray(phoneNumbers)) {
//     return next(
//       new ErrorResponse("phoneNumbers must be a non-empty array", 400)
//     );
//   }

//   const contacts = await User.find({
//     phoneNumber: { $in: phoneNumbers },
//   }).select("firstName lastName phoneNumber email profilePicture");

//   if (!contacts || contacts.length === 0) {
//     return next(new ErrorResponse("No contacts found", 404));
//   }

//   baseResponseHandler({
//     message: `Contact Retrived Successfully`,
//     res,
//     statusCode: 200,
//     success: true,
//     data: contacts
//   });

// });

export const getContacts = asyncHandler(async (req, res, next) => {
  const { phoneNumbers } = req.body;

  // Validate that phoneNumbers is an array
  if (!Array.isArray(phoneNumbers)) {
    return next(
      new ErrorResponse("phoneNumbers must be a non-empty array", 400)
    );
  }

  // Normalize the incoming phone numbers
  const normalizedNumbers = phoneNumbers.map((num: string) =>
    normalizePhoneNumber(num)
  );

  // Use a regular expression to match the last 8-10 digits
  const contacts = await User.find({
    phoneNumber: {
      $regex: new RegExp(normalizedNumbers.map((num) => num).join("|")),
    },
  }).select("firstName lastName phoneNumber email profilePicture");

//   if (!contacts || contacts.length === 0) {
//     return next(new ErrorResponse("No contacts found", 404));
//   }

  baseResponseHandler({
    message: "Contacts Retrieved Successfully",
    res,
    statusCode: 200,
    success: true,
    data: contacts || [],
  });
});
