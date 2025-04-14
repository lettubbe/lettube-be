import asyncHandler from "express-async-handler";
import Feed from "../../models/Feed";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import { getAuthUser, normalizePhoneNumber } from "../../lib/utils/utils";
import ErrorResponse from "../../messages/ErrorResponse";
import User from "../../models/User";
import { samplePosts } from "../../_data/posts";
import Post from "../../models/Post";
import { getPaginateOptions, transformPaginateResponse } from "../../lib/utils/paginate";
import Auth from "../../models/Auth";
import { uploadFile, uploadFileFromFields } from "../../lib/utils/fileUpload";

// @desc    Add Category to user Feed
// @route   POST /api/v1/feed/category
// @access  Private

export const createCategoryFeeds = asyncHandler(async (req, res, next) => {
  const { categories = [], excludedCategories = [] } = req.body;

  const user = await getAuthUser(req, next);

  // Find an existing feed document for the user
  let categoryFeed = await Feed.findOne({ user: user._id });

  // const authUser = await Auth.findOne({ user: user._id});

  // if(!authUser){
  //   return next(new ErrorResponse(`User Profile Not found`, 404));
  // }

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

  // authUser.isCategorySet = true;

  await categoryFeed.save();
  // await authUser.save();

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

  console.log("user", user);

  const posts = samplePosts;

  baseResponseHandler({
    message: `User Feeds Retrived successfully`,
    res,
    statusCode: 200,
    success: true,
    data: posts,
  });
});

// @desc     Get User Feed
// @route   GET /api/v1/feed/uploads
// @access  private

export const getUserUploadedFeeds = asyncHandler(async (req, res, next) => {
  const user = await getAuthUser(req, next);

  const { page, limit } = req.params;

  const options = getPaginateOptions(page, limit);

  const posts = await Post.paginate({ user: user._id }, options);

  const postsTransformedData = transformPaginateResponse(posts);

  baseResponseHandler({
    message: `User Feeds Retrived successfully`,
    res,
    statusCode: 200,
    success: true,
    data: postsTransformedData,
  });
});

// @desc     Get User Feed
// @route    GET /api/v1/feed/phoneNumbers
// @access   Private

export const getContacts = asyncHandler(async (req, res, next) => {
  const { phoneNumbers } = req.body;

  
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

  baseResponseHandler({
    message: "Contacts Retrieved Successfully",
    res,
    statusCode: 200,
    success: true,
    data: contacts || [],
  });
});

// @desc     Get User Feed
// @route    GET /api/v1/feed/upload
// @access   Private

export const uploadFeedPost = asyncHandler(async (req, res, next) => {
  const user = await getAuthUser(req, next);

  let tagsArray;

  const thumbnailImage = await uploadFileFromFields(
    req,
    next,
    `feedThunbnail/${user._id}/thumbnails`,
    "thumbnailImage"
  );

  const postVideo = await uploadFileFromFields(
    req,
    next,
    `feedVideos/${user._id}/videos`,
    "postVideo"
  );

  const { tags, category, description, visibility, isCommentsAllowed } =
    req.body;

  console.log("req.body", req.body);

  tagsArray =
    typeof tags === "string" ? JSON.parse(tags.replace(/'/g, '"')) : tags;
  const isCommentsAllowedBool =
    String(isCommentsAllowed).toLowerCase() === "true";

  const postFeed = {
    user: user._id,
    tags: tagsArray,
    category,
    description,
    visibility,
    isCommentsAllowed: isCommentsAllowedBool,
    videoUrl: postVideo,
    thumbnail: thumbnailImage,
  };

  const post = await Post.create(postFeed);

  baseResponseHandler({
    message: "Post Created Successfully",
    res,
    statusCode: 200,
    success: true,
    data: post,
  });
});
