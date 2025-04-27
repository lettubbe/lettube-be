import asyncHandler from "express-async-handler";
import Feed from "../../models/Feed";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import { getAuthUser, normalizePhoneNumber } from "../../lib/utils/utils";
import ErrorResponse from "../../messages/ErrorResponse";
import User from "../../models/User";
import Post from "../../models/Post";
import {
  getPaginateOptions,
  transformPaginateResponse,
} from "../../lib/utils/paginate";
import { uploadFileFromFields } from "../../lib/utils/fileUpload";
import mongoose from "mongoose"; // make sure mongoose is imported

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
  console.log("hitting getting user feeds");

  const user = await getAuthUser(req, next);

  console.log("user", user);

  const { page, limit } = req.query;

  const options = getPaginateOptions(page, limit, {
    populate: [
      {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    ],
  });

  const posts = await Post.paginate({ user: user._id }, options);

  console.log("posts", posts);

  const postsData = transformPaginateResponse(posts);

  // console.log("postsData", postsData);

  baseResponseHandler({
    message: `User Feeds Retrived successfully`,
    res,
    statusCode: 200,
    success: true,
    data: postsData,
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
  console.log("hitting upload feed post");

  const user = await getAuthUser(req, next);

  let tagsArray;

  console.log("body", req.body);

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

  console.log("tags", tags);

  if (!thumbnailImage) {
    return next(
      new ErrorResponse(
        `Error Occured when uploading Thumbnail. Please Check your connection and try again`,
        500
      )
    );
  }

  if (!postVideo) {
    return next(
      new ErrorResponse(
        `Error Occured when uploading Video. Please Check your connection and try again`,
        500
      )
    );
  }

  // tagsArray =
  //   typeof tags === "string" ? JSON.parse(tags.replace(/'/g, '"')) : tags;

  console.log("tags", tags);

  // Split comma-separated string into array
  tagsArray = typeof tags === "string" ? tags.split(",") : tags;

  if (!tagsArray || tagsArray.length === 0) {
    return next(new ErrorResponse("tags is required", 400));
  }

  const isCommentsAllowedBool =
    String(isCommentsAllowed).toLowerCase() === "true";

  if (tagsArray.length == 0) {
    return next(new ErrorResponse(`tags is required`, 400));
  }

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

// @desc     Get User Feed
// @route    GET /api/v1/feed/:postId/like
// @access   Private

export const likePost = asyncHandler(async (req, res, next) => {
  console.log("hitting like post");

  const { postId } = req.params;
  const user = await getAuthUser(req, next);
  const userId = user._id;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ErrorResponse(`Post Not Found`, 404));
  }

  const hasLiked = post.reactions.likes.some(
    (id) => id.toString() === userId.toString()
  );

  const update = hasLiked
    ? {
        $pull: { "reactions.likes": userId },
      }
    : {
        $addToSet: { "reactions.likes": userId },
        $pull: { "reactions.dislikes": userId },
      };

  const updatedPost = await Post.findByIdAndUpdate(postId, update, {
    new: true,
    runValidators: true, // optional, but nice
  });

  baseResponseHandler({
    message: `Post Liked Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: updatedPost?.reactions,
  });
});

// @desc      Liking a comment or reply to a comment
// @route     /posts/:postId/comments/:commentId/replies/:replyId/like
//            /posts/:postId/comments/:commentId/like
// @access    Private

export const replyToComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;

  const { text } = req.body;

  const user = await getAuthUser(req, next);

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse(`Post Not Found`, 404));
  }

  const comment = post.comments.find((c: any) => c._id.toString() === commentId);

  if (!comment) {
    return next(new ErrorResponse(`Comment not found`, 404));
  }

  const newReply = {
    user: user._id,
    text,
    likes: [],
    createdAt: new Date(),
  };

  comment.replies.push(newReply);
  await post.save();

  baseResponseHandler({
    message: `Reply Done Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: comment,
  });
});

// @desc       Like A Comment
// @route      /posts/:postId/comments/:commentId/replies
// @access     Private

// export const likeComment = asyncHandler(async (req, res, next) => {
//   const { postId, commentId, replyId } = req.params;
//   const userId = req.user._id;

//   const post = await Post.findById(postId);

//   if (!post) {
//     return next(new ErrorResponse(`Post Not Found`, 404));
//   }

//   const comment = post.comments.find((c: any) => c._id.toString() === commentId);

//   if (!comment) {
//     return next(new ErrorResponse(`Comment Not Found`, 404));
//   }

//   if (replyId) {
//     // Like a reply
//     const reply = comment.replies.find((r: any) => r._id.toString() === replyId);
//     if (!reply) {
//       return next(new ErrorResponse(`Reply not found`, 404));
//     }

//     if (reply.likes.some(id => id.toString() === userId.toString())) {
//       reply.likes = reply.likes.filter(id => id.toString() !== userId.toString());
//     } else {
//       reply.likes.push(userId);
//     }

//   } else {
//     if (comment.likes.some(id => id.toString() === userId.toString())) {
//       comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
//     } else {
//       comment.likes.push(userId);
//     }
//   }

//   await post.save();

//   baseResponseHandler({
//     message: `Post Liked Successfully`,
//     res,
//     statusCode: 201,
//     success: true,
//     data: comment
//   })

// });

// export const likeComment = asyncHandler(async (req, res, next) => {
//   const { postId, commentId, replyId } = req.params;
//   const userId = req.user._id;

//   const post = await Post.findById(postId);

//   if (!post) {
//     return next(new ErrorResponse(`Post Not Found`, 404));
//   }

//   const comment = post.comments.find((c: any) => c._id.toString() === commentId);

//   if (!comment) {
//     return next(new ErrorResponse(`Comment Not Found`, 404));
//   }

//   if (replyId) {
//     // --- Like/Unlike a REPLY ---
//     const reply = comment.replies.find((r: any) => r._id.toString() === replyId);

//     if (!reply) {
//       return next(new ErrorResponse(`Reply Not Found`, 404));
//     }

//     const alreadyLiked = reply.likes.some(id => id.toString() === userId.toString());

//     const update = alreadyLiked
//       ? { $pull: { "comments.$[comment].replies.$[reply].likes": userId } }
//       : { $addToSet: { "comments.$[comment].replies.$[reply].likes": userId } };

//     await Post.updateOne(
//       {
//         _id: postId,
//         "comments._id": commentId,
//         "comments.replies._id": replyId,
//       },
//       update,
//       {
//         arrayFilters: [
//           { "comment._id": commentId },
//           { "reply._id": replyId },
//         ],
//       }
//     );

//     const updatedPost = await Post.findById(postId); // <-- Fetch the updated post!

//     return baseResponseHandler({
//       res,
//       statusCode: 200,
//       success: true,
//       message: alreadyLiked ? "Reply Unliked Successfully" : "Reply Liked Successfully",
//       data: updatedPost?.comments, // Return updated comments
//     });

//   } else {
//     // --- Like/Unlike a COMMENT ---
//     const alreadyLiked = comment.likes.some(id => id.toString() === userId.toString());

//     const update = alreadyLiked
//       ? { $pull: { "comments.$.likes": userId } }
//       : { $addToSet: { "comments.$.likes": userId } };

//     await Post.updateOne(
//       {
//         _id: postId,
//         "comments._id": commentId,
//       },
//       update
//     );

//     const updatedPost = await Post.findById(postId); // <-- Fetch the updated post!

//     return baseResponseHandler({
//       res,
//       statusCode: 200,
//       success: true,
//       message: alreadyLiked ? "Comment Unliked Successfully" : "Comment Liked Successfully",
//       data: updatedPost?.comments, // Return updated post
//     });
//   }
// });

export const likeComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId, replyId } = req.params;
  const user = await getAuthUser(req, next);

  const userId = user._id;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse(`Post Not Found`, 404));
  }

  const comment = post.comments.find((c: any) => c._id.toString() === commentId);

  if (!comment) {
    return next(new ErrorResponse(`Comment Not Found`, 404));
  }

  const userObjectId = new mongoose.Types.ObjectId(userId); // <- ensure correct type

  if (replyId) {
    // Like/Unlike a REPLY
    const reply = comment.replies.find((r: any) => r._id.toString() === replyId);

    if (!reply) {
      return next(new ErrorResponse(`Reply Not Found`, 404));
    }

    const alreadyLiked = reply.likes.some(id => id.toString() === userId.toString());

    const update = alreadyLiked
      ? { $pull: { "comments.$[comment].replies.$[reply].likes": userObjectId } }
      : { $addToSet: { "comments.$[comment].replies.$[reply].likes": userObjectId } };

    await Post.updateOne(
      {
        _id: postId,
        "comments._id": commentId,
        "comments.replies._id": replyId,
      },
      update,
      {
        arrayFilters: [
          { "comment._id": new mongoose.Types.ObjectId(commentId) },
          { "reply._id": new mongoose.Types.ObjectId(replyId) },
        ],
      }
    );

  } else {
    // Like/Unlike a COMMENT
    const alreadyLiked = comment.likes.some(id => id.toString() === userId.toString());

    const update = alreadyLiked
      ? { $pull: { "comments.$.likes": userObjectId } }
      : { $addToSet: { "comments.$.likes": userObjectId } };

    await Post.updateOne(
      {
        _id: postId,
        "comments._id": commentId,
      },
      update
    );
  }

  const updatedPost = await Post.findById(postId);

  return baseResponseHandler({
    res,
    statusCode: 200,
    success: true,
    message: "Action performed successfully",
    data: updatedPost?.comments,
  });
});



// @desc      Make Comment On A Post
// @route     /posts/:postId/comments
// @access    Private

export const commentOnPost = asyncHandler(async (req, res, next) => {

  const { postId } = req.params;
  const { text } = req.body;

  const user = await getAuthUser(req, next);

  const newComment = {
    user: user._id,
    text,
    likes: [],
    replies: [],
    createdAt: new Date(),
  };

  const post = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: newComment } },
    { new: true, runValidators: true }
  );

  if (!post) {
    return next(new ErrorResponse(`Post Not Found`, 404));
  }

  baseResponseHandler({
    message: `Comment Added Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: post.comments,
  });
});

// @desc      Dislike A Post
// @route     /posts/:postId/dislike
// @access    Private

export const dislikePost = asyncHandler(async (req, res, next) => {
  console.log("hitting dislike post");

  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ErrorResponse(`Post Not Found`, 404));
  }

  const hasDisliked = post.reactions.dislikes.some(
    (id) => id.toString() === userId.toString()
  );

  const update = hasDisliked
    ? {
        // User already disliked → remove from dislikes
        $pull: { "reactions.dislikes": userId },
      }
    : {
        // User not disliked yet → add to dislikes
        $addToSet: { "reactions.dislikes": userId },
        $pull: { "reactions.likes": userId }, // Remove from likes if any
      };

  const updatedPost = await Post.findByIdAndUpdate(postId, update, {
    new: true,
    runValidators: true,
  });

  baseResponseHandler({
    message: `Post Disliked Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: updatedPost?.reactions,
  });
});

