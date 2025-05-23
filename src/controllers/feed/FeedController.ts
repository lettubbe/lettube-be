import asyncHandler from "express-async-handler";
import Feed from "../../models/Feed/Feed";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import {
  getAuthUser,
  getRemoteVideoDuration,
  normalizePhoneNumber,
} from "../../lib/utils/utils";
import ErrorResponse from "../../messages/ErrorResponse";
import User from "../../models/Auth/User";
import Post from "../../models/Feed/Post";
import {
  getPaginateOptions,
  transformPaginateResponse,
} from "../../lib/utils/paginate";
import { uploadFileFromFields } from "../../lib/utils/fileUpload";
import mongoose, { Types } from "mongoose";
import Playlist from "../../models/Feed/Playlist";
import Bookmark from "../../models/Feed/Bookmark";
import Notification from "../../models/Notifications";
import NotificationService from "../../services/notificationService";
import { getCommentsQuery } from "../../services/commentService";
import NotInterestedModel from "../../models/Feed/NotInterested";
import BlockedChannel from "../../models/Feed/BlockedChannel";
import { NotificationStatusEnum } from "../../constants/enums/NotificationEnums";
import { IPushNotificationBody } from "../../lib/interfaces/notification.interface";
import VideoView from "../../models/Feed/VideoViews";
import { sortModeType } from "../../lib/interfaces/filter.interface";
import {
  feedtransformedPostData,
  getPostsQuery,
} from "../../services/feedService";

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
// @route   GET /api/v1/feed/uploads
// @access  private

export const getUserUploadedFeeds = asyncHandler(async (req, res, next) => {
  const user = await getAuthUser(req, next);

  const {
    page = 1,
    limit = 10,
    search = "",
    mode = "latest",
  } = req.query as unknown as {
    page: number;
    limit: number;
    search: string;
    mode: sortModeType;
  };

  const options = await getPostsQuery({ page, search, mode, limit });
  const posts = await Post.paginate({ user: user._id }, options);

  const postIds = posts.docs.map((post) => (post as any)._id);

  // Get user's bookmarks for these posts
  const bookmarks = await Bookmark.find({
    user: user._id,
    post: { $in: postIds },
  });

  const bookmarkedPostIds = new Set(bookmarks.map((b) => b.post.toString()));

  const videoViews = await VideoView.find({ post: { $in: postIds } }).lean();
  const viewCountsMap = new Map<string, number>();
  videoViews.forEach((v) => {
    viewCountsMap.set(v.post.toString(), v.views.length);
  });

  const cleanPosts = {
    ...posts,
    docs: feedtransformedPostData(posts.docs, {
      bookmarkedPostIds,
      viewCountsMap,
    }),
  };

  const postsTransformedData = transformPaginateResponse(posts);

  baseResponseHandler({
    message: `User Feeds Retrieved successfully`,
    res,
    statusCode: 200,
    success: true,
    data: cleanPosts,
  });
});

// @desc     Get User Feed
// @route   GET /api/v1/feed/:postId/views
// @access  private

export const addVideoViews = asyncHandler(async (req, res, next) => {
  const user = await getAuthUser(req, next);

  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse(`Post Not Found`, 404));
  }

  const video = await VideoView.findOne({ post: postId });

  if (!video) {
    VideoView.create({ post: postId });
  }

  if (video && !video.views.includes(user._id)) {
    video.views.push(user._id);
    await video.save();
  }

  baseResponseHandler({
    res,
    statusCode: 200,
    data: video,
    success: true,
    message: `Video Viewed successfully`,
  });
});

// @desc     Get User Feed
// @route   GET /api/v1/feed/uploads/user/public
// @access  private

export const getUserPublicUploadedFeeds = asyncHandler(async (req, res, next) => {
  const { userId } = req.query;
  const {
    page = 1,
    limit = 10,
    search = "",
    mode = "latest",
  } = req.query as unknown as {
    page: number;
    limit: number;
    search: string;
    mode: sortModeType;
  };

  const options = await getPostsQuery({ page, search, mode, limit });

  const posts = await Post.paginate({ user: userId }, options);

  const postIds = posts.docs.map((post) => (post as any)._id);

  // Get user's bookmarks for these posts
  const bookmarks = await Bookmark.find({
    user: userId,
    post: { $in: postIds },
  });

  const bookmarkedPostIds = new Set(bookmarks.map((b) => b.post.toString()));

  const videoViews = await VideoView.find({ post: { $in: postIds } }).lean();
  const viewCountsMap = new Map<string, number>();
  videoViews.forEach((v) => {
    viewCountsMap.set(v.post.toString(), v.views.length);
  });

  const cleanPosts = {
    ...posts,
    docs: feedtransformedPostData(posts.docs, {
      bookmarkedPostIds,
      viewCountsMap,
    }),
  };

  const postsTransformedData = transformPaginateResponse(posts);

  baseResponseHandler({
    message: `User Feeds Retrieved successfully`,
    res,
    statusCode: 200,
    success: true,
    data: cleanPosts,
  });
}
);

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

  console.log("body", req.body);

  const thumbnailImage = await uploadFileFromFields(
    req,
    next,
    `feedThumbnail/${user._id}/thumbnails`,
    "thumbnailImage"
  );

  const postVideo = await uploadFileFromFields(
    req,
    next,
    `feedVideos/${user._id}/videos`,
    "postVideo"
  );

  const {
    tags,
    category,
    description,
    visibility,
    playlistId,
    isCommentsAllowed,
  } = req.body;

  if (!thumbnailImage) {
    return next(
      new ErrorResponse(
        `Error Occurred when uploading Thumbnail. Please Check your connection and try again`,
        500
      )
    );
  }

  if (!postVideo) {
    return next(
      new ErrorResponse(
        `Error Occurred when uploading Video. Please Check your connection and try again`,
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

  const duration = await getRemoteVideoDuration(postVideo);

  const postFeed = {
    user: user._id,
    tags: tagsArray,
    category,
    description,
    visibility,
    duration,
    isCommentsAllowed: isCommentsAllowedBool,
    videoUrl: postVideo,
    thumbnail: thumbnailImage,
  };

  const post = await Post.create(postFeed);

  if (playlistId) {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return next(new ErrorResponse("Playlist not found", 404));
    }

    playlist.videos.push(post._id);
    await playlist.save();
  }

  baseResponseHandler({
    message: "Post Created Successfully",
    res,
    statusCode: 200,
    success: true,
    data: post,
  });
});

// @desc     Edit User Feed Post
// @route    PATCH /api/v1/feed/upload/:postId
// @access   Private

export const editFeedPost = asyncHandler(async (req, res, next) => {
  const user = await getAuthUser(req, next);
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  // Only allow post owner to edit
  if (String(post.user) !== String(user._id)) {
    return next(new ErrorResponse("Not authorized to edit this post", 403));
  }

  const {
    tags,
    category,
    description,
    visibility,
    isCommentsAllowed,
    playlistId,
  } = req.body;

  let tagsArray;
  if (tags) {
    tagsArray = typeof tags === "string" ? tags.split(",") : tags;
    if (!Array.isArray(tagsArray) || tagsArray.length === 0) {
      return next(new ErrorResponse("tags is required", 400));
    }
    post.tags = tagsArray;
  }

  if (category) post.category = category;
  if (description) post.description = description;
  if (visibility) post.visibility = visibility;
  if (isCommentsAllowed !== undefined) {
    post.isCommentsAllowed = String(isCommentsAllowed).toLowerCase() === "true";
  }

  // Replace thumbnail if provided
  const newThumbnail = await uploadFileFromFields(
    req,
    next,
    `feedThumbnail/${user._id}/thumbnails`,
    "thumbnailImage"

  );
  if (newThumbnail) {
    post.thumbnail = newThumbnail;
  }

  // Replace video if provided
  const newVideo = await uploadFileFromFields(
    req,
    next,
    `feedVideos/${user._id}/videos`,
    "postVideo"
  );

  if (newVideo) {
    post.videoUrl = newVideo;
    post.duration = await getRemoteVideoDuration(newVideo);
  }

  if (playlistId) {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return next(new ErrorResponse("Playlist not found", 404));
    }

    // Avoid duplicate entries
    if (!playlist.videos.includes(post._id)) {
      playlist.videos.push(post._id);
      await playlist.save();
    }
  }

  await post.save();

  baseResponseHandler({
    message: "Post Updated Successfully",
    res,
    statusCode: 200,
    success: true,
    data: post,
  });
});

// @desc     Edit User Feed Post
// @route    GET /api/v1/feed/upload/:postId
// @access   Private

export const getPostFeed = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).select("-comments");

  if (!postId) {
    return next(new ErrorResponse(`Post Not Found`, 404));
  }

  baseResponseHandler({
    message: `Post Retrieved Successfully`,
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
    runValidators: true,
  });

  if (!hasLiked) {
    const existing = await Notification.findOne({
      userId: post.user,
      type: "like",
      videoId: postId,
    });

    if (existing) {
      if (!existing.actorIds.includes(user._id)) {
        existing.actorIds.push(user._id);
        existing.createdAt = new Date();
        await existing.save();

        await NotificationService.sendNotification(post.user as any, {
          title: `{existing.actorIds.length} liked your post`,
          description: `${user.username} liked your post`,
        });
      }
    } else {
      await Notification.create({
        userId: post.user,
        actorIds: [user._id],
        post: postId,
        subType: "postLike",
        type: "like",
        videoId: postId,
        createdAt: new Date(),
        read: false,
      });
    }

    await NotificationService.sendNotification(post.user as any, {
      title: `${user.username} liked your post`,
      description: `${user.username} Just liked your post`,
    });
  }

  baseResponseHandler({
    message: `Post Liked Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: updatedPost?.reactions,
  });
});

// @desc     Get User Feed
// @route    GET /api/v1/feed/notifications
// @access   Private

export const getFeedNotifications = asyncHandler(async (req, res, next) => {
  const user = await getAuthUser(req, next);
  const { page, limit, type } = req.query;

  console.log("type", type);

  const filter: any = {
    userId: user._id,
  };

  // If type is provided and valid, add it to the filter
  if (type && ["like", "comment", "subscription"].includes(type as any)) {
    filter.type = type;
  }

  if (type && ["reply"].includes(type as any)) {
    filter.subType = "replyLike";
  }

  console.log("filter", filter);

  const options = getPaginateOptions(page, limit, {
    populate: [
      {
        path: "userId",
        select: "username firstName lastName profilePicture",
      },
      {
        path: "post",
      },
      {
        path: "actorIds",
        select: "username firstName lastName profilePicture",
      },
    ],
  });

  const notificationsData = await Notification.paginate(filter, options);
  const notifications = transformPaginateResponse(notificationsData);

  await Notification.updateMany(
    { userId: user._id, status: NotificationStatusEnum.UNREAD },
    { $set: { status: NotificationStatusEnum.READ } }
  );

  // console.log("notifications", notifications);

  baseResponseHandler({
    message: `User Notifications Retrieved successfully`,
    res,
    statusCode: 200,
    success: true,
    data: notifications,
  });
});

// @desc     Get User Feed
// @route    GET /api/v1/feed/notifications/count
// @access   Private

export const getFeedNotificationsCount = asyncHandler(
  async (req, res, next) => {
    const user = await getAuthUser(req, next);

    const notifications = await Notification.countDocuments({
      read: true,
      userId: user._id,
    });

    res
      .status(200)
      .json({ success: true, data: notifications, statusCode: 200 });
  }
);

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

  const comment = post.comments.find(
    (c: any) => c._id.toString() === commentId
  );

  if (!comment) {
    return next(new ErrorResponse(`Comment not found`, 404));
  }

  const newReply = {
    user: user._id,
    text,
    likes: [],
    createdAt: new Date(),
  };

  // @ts-ignore
  comment.replies.push(newReply);
  await post.save();

  const commentNotificationPayload: IPushNotificationBody = {
    title: `Reply to your comment`,
    description: `${user.username} replied to your comment`,
  };

  const now = new Date();

  const existingNotification = await Notification.findOne({
    userId: comment.user,
    type: "comment",
    commentId: commentId,
  });

  if (existingNotification) {
    if (!existingNotification.actorIds.includes(user._id)) {
      existingNotification.actorIds.push(user._id);
      existingNotification.createdAt = now;
      await existingNotification.save();

      const existingCommentNotificationPayload: IPushNotificationBody = {
        title: `Reply to your comment`,
        description: `${existingNotification.actorIds.length} replied to your comment`,
      };

      await NotificationService.sendNotification(
        comment.user as any,
        existingCommentNotificationPayload
      );
    }
  } else {
    await Notification.create({
      userId: comment.user,
      actorIds: [user._id],
      type: "comment",
      videoId: postId,
      commentId: commentId,
      read: false,
    });

    await NotificationService.sendNotification(
      comment.user as any,
      commentNotificationPayload
    );
  }

  await Notification.create({
    userId: comment.user,
    actorIds: [user._id],
    post: postId,
    type: "comment",
    videoId: postId,
    createdAt: new Date(),
    read: false,
  });
  await Notification.create({
    userId: comment.user,
    actorIds: [user._id],
    post: postId,
    type: "comment",
    videoId: postId,
    createdAt: new Date(),
    read: false,
  });
  // await NotificationService.sendNotification(comment.user as any, {});

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

export const likeComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId, replyId } = req.params;
  const user = await getAuthUser(req, next);

  const userId = user._id;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse(`Post Not Found`, 404));
  }

  const comment = post.comments.find(
    (c: any) => c._id.toString() === commentId
  );

  if (!comment) {
    return next(new ErrorResponse(`Comment Not Found`, 404));
  }

  const userObjectId = new mongoose.Types.ObjectId(userId); // <- ensure correct type

  if (replyId) {
    // Like/Unlike a REPLY
    const reply = comment.replies.find(
      (r: any) => r._id.toString() === replyId
    );

    if (!reply) {
      return next(new ErrorResponse(`Reply Not Found`, 404));
    }

    const alreadyLiked = reply.likes.some(
      (id) => id.toString() === userId.toString()
    );

    const update = alreadyLiked
      ? {
        $pull: { "comments.$[comment].replies.$[reply].likes": userObjectId },
      }
      : {
        $addToSet: {
          "comments.$[comment].replies.$[reply].likes": userObjectId,
        },
      };

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

    if (!alreadyLiked) {
      const existing = await Notification.findOne({
        userId: reply.user,
        type: "like",
        videoId: postId,
        commentId: replyId,
      });

      if (existing) {
        if (!existing.actorIds.includes(user._id)) {
          existing.actorIds.push(user._id);
          existing.createdAt = new Date();
          await existing.save();

          await NotificationService.sendNotification(reply.user as any, {
            title: `${existing.actorIds.length} people liked your reply`,
            description: `${user.username} liked your reply`,
          });
        }
      } else {
        await Notification.create({
          userId: reply.user,
          actorIds: [user._id],
          post: postId,
          subType: "replyLike",
          commentText: reply.text,
          type: "like",
          videoId: postId,
          commentId: replyId,
          createdAt: new Date(),
          read: false,
        });

        await NotificationService.sendNotification(reply.user as any, {
          title: `${user.username} liked your reply`,
          description: `${user.username} liked your reply to a comment`,
        });
      }
    }
  } else {
    const alreadyLiked = comment.likes.some(
      (id) => id.toString() === userId.toString()
    );

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

    if (!alreadyLiked) {
      const existing = await Notification.findOne({
        userId: comment.user,
        type: "like",
        videoId: postId,
        commentId: commentId,
      });

      if (existing) {
        if (!existing.actorIds.includes(user._id)) {
          existing.actorIds.push(user._id);
          existing.createdAt = new Date();
          await existing.save();

          await NotificationService.sendNotification(comment.user as any, {
            title: `${existing.actorIds.length} people liked your comment`,
            description: `${user.username} liked your comment`,
          });
        }
      } else {
        await Notification.create({
          userId: comment.user,
          actorIds: [user._id],
          type: "like",
          subType: "commentLike",
          post: postId,
          videoId: postId,
          commentId: commentId,
          commentText: comment.text,
          createdAt: new Date(),
          read: false,
        });

        await NotificationService.sendNotification(comment.user as any, {
          title: `${user.username} liked your comment`,
          description: `${user.username} liked your comment on a post`,
        });
      }
    }
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

// @desc      get Comments On A Post
// @route     GET /posts/:postId/comments
// @access    Private

export const getPostComments = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const {
    page = 1,
    limit = 10,
    search = "",
    mode = "newest",
  } = req.query as unknown as {
    page: number;
    limit: number;
    search: string;
    mode: sortModeType;
  };

  const query = getCommentsQuery(postId, { page, limit, search, mode });
  const post = await query;

  if (!post) {
    return next(new ErrorResponse("Post Not Found", 404));
  }

  const transformedComments = post.comments.map((comment) => ({
    _id: comment._id,
    user: comment.user,
    text: comment.text,
    likes: comment.likes,
    replies: comment.replies.map((reply) => ({
      _id: reply._id,
      user: reply.user,
      text: reply.text,
      likes: reply.likes,
      createdAt: reply.createdAt,
    })),
    createdAt: comment.createdAt,
  }));

  const totalComments = await Post.findById(postId)
    .select("comments")
    .then((p) => p?.comments?.length || 0);

  // Calculate pagination info
  const totalPages = Math.ceil(totalComments / Number(limit));
  const hasNextPage = Number(page) * Number(limit) < totalComments;
  const hasPrevPage = Number(page) > 1;

  baseResponseHandler({
    message: transformedComments.length
      ? "Post Comments Retrieved Successfully"
      : "No Comments Found",
    res,
    statusCode: 200,
    success: true,
    data: transformPaginateResponse({
      docs: transformedComments,
      totalDocs: totalComments,
      limit: Number(limit),
      totalPages,
      page: Number(page),
      pagingCounter: (Number(page) - 1) * Number(limit) + 1,
      hasPrevPage,
      hasNextPage,
      prevPage: hasPrevPage ? Number(page) - 1 : null,
      nextPage: hasNextPage ? Number(page) + 1 : null,
    }),
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

  await Notification.create({
    userId: post.user,
    actorIds: [user._id],
    type: "comment",
    commentText: text,
    post: postId,
    createdAt: new Date(),
    read: false,
  });

  // Send push notification
  await NotificationService.sendNotification(post.user as any, {
    title: `${user.username} commented on your post`,
    description: `${user.username} commented: ${text.substring(0, 50)}${text.length > 50 ? "..." : ""
      }`,
  });

  baseResponseHandler({
    message: `Comment Added Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: post.comments,
  });
});

// @desc      Delete Comment On A Post
// @route     /posts/:postId/comments/:commentId/:postId
// @access    Private

export const deletePostComment = asyncHandler(async (req, res, next) => {
  const { commentId, postId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(commentId) ||
    !mongoose.Types.ObjectId.isValid(postId)
  ) {
    return next(new ErrorResponse("Invalid comment or post ID", 400));
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  const commentIndex = post.comments.findIndex(
    (comment) => comment._id.toString() === commentId
  );

  if (commentIndex === -1) {
    return next(new ErrorResponse("Comment not found", 404));
  }

  post.comments.splice(commentIndex, 1);

  await post.save();

  baseResponseHandler({
    res,
    message: "Comment deleted successfully",
    success: true,
    data: post.comments,
    statusCode: 200,
  });
});

// @desc      Dislike A Post
// @route     /posts/:postId/dislike
// @access    Private

export const dislikePost = asyncHandler(async (req, res, next) => {
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

// @desc      Bookmark Video
// @route     POST /posts/:postId/bookmark
// @access    Private

export const bookmarkPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const user = await getAuthUser(req, next);
  const userId = user._id;

  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    return next(new ErrorResponse(`Post Not Found`, 404));
  }

  // Check if already bookmarked
  const existingBookmark = await Bookmark.findOne({
    user: userId,
    post: postId,
  });

  if (existingBookmark) {
    // Remove bookmark
    await Bookmark.deleteOne({ _id: existingBookmark._id });

    baseResponseHandler({
      message: "Post Unbookmarked Successfully",
      res,
      statusCode: 200,
      success: true,
      data: { isBookmarked: false },
    });
  } else {
    // Add new bookmark
    const bookmark = await Bookmark.create({ user: userId, post: postId });

    baseResponseHandler({
      message: "Post Bookmarked Successfully",
      res,
      statusCode: 200,
      success: true,
      data: { isBookmarked: true },
    });
  }
});

// @desc      Get User's Bookmarked Posts
// @route     GET /posts/bookmarks
// @access    Private

export const getBookmarkedPosts = asyncHandler(async (req, res, next) => {
  const user = await getAuthUser(req, next);
  const { page, limit, searchTerm } = req.query;

  const options = getPaginateOptions(page, limit, {
    populate: {
      path: "post",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    },
  });

  const bookmarks = await Bookmark.paginate({ user: user._id }, options);

  // Transform the response to return posts with isBookmarked flag
  const transformedData = {
    ...bookmarks,
    docs: bookmarks.docs.map((bookmark) => ({
      ...(bookmark.post as any)?.toObject(),
      isBookmarked: true,
    })),
  };

  baseResponseHandler({
    message: "Bookmarked Posts Retrieved Successfully",
    res,
    statusCode: 200,
    success: true,
    data: transformPaginateResponse(transformedData),
  });
});

// @desc      Get User's Feed Posts
// @route     GET /posts/feed
// @access    Private

export const getUserFeeds = asyncHandler(async (req, res, next) => {
  const user = await getAuthUser(req, next);
  const { page, limit } = req.query;

  // Get posts IDs that user is not interested in
  const notInterestedPosts = await NotInterestedModel.find({ user: user._id })
    .select("post")
    .lean();
  const notInterestedPostIds = notInterestedPosts.map((item) => item.post);

  const options = getPaginateOptions(page, limit, {
    populate: [
      {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    ],
  });

  // Filter out not interested posts
  const query = {
    _id: { $nin: notInterestedPostIds },
  };

  const posts = await Post.paginate(query, options);

  const postIds = posts.docs.map((post) => (post as any)._id);

  // Get user's bookmarks for these posts
  const bookmarks = await Bookmark.find({
    user: user._id,
    post: { $in: postIds },
  });

  const bookmarkedPostIds = new Set(bookmarks.map((b) => b.post.toString()));

  // Get views for all posts in one query
  const videoViews = await VideoView.find({ post: { $in: postIds } }).lean();
  const viewCountsMap = new Map<string, number>();
  videoViews.forEach((v) => {
    viewCountsMap.set(v.post.toString(), v.views.length);
  });

  // Transform and clean up the response data
  // const cleanPosts = {
  //   ...posts,
  //   docs: posts.docs.map((post) => {
  //     const postObj = (post as any).toObject();
  //     const postIdStr = postObj._id.toString();
  //     return {
  //       _id: postObj._id,
  //       user: {
  //         _id: postObj.user._id,
  //         username: postObj.user.username,
  //         firstName: postObj.user.firstName,
  //         lastName: postObj.user.lastName,
  //         profilePicture: postObj.user.profilePicture,
  //       },
  //       category: postObj.category,
  //       thumbnail: postObj.thumbnail,
  //       videoUrl: postObj.videoUrl,
  //       description: postObj.description,
  //       visibility: postObj.visibility,
  //       tags: postObj.tags,
  //       isCommentsAllowed: postObj.isCommentsAllowed,
  //       reactions: postObj.reactions,
  //       comments: postObj.comments,
  //       createdAt: postObj.createdAt,
  //       updatedAt: postObj.updatedAt,
  //       duration: postObj.duration,
  //       isBookmarked: bookmarkedPostIds.has(postIdStr),
  //       views: viewCountsMap.get(postIdStr) || 0,
  //     };
  //   }),
  // };

  const cleanPosts = {
    ...posts,
    docs: feedtransformedPostData(posts.docs, {
      bookmarkedPostIds,
      viewCountsMap,
    }),
  };

  baseResponseHandler({
    message: `User Feeds Retrieved successfully`,
    res,
    statusCode: 200,
    success: true,
    data: transformPaginateResponse(cleanPosts),
  });
});

// @desc      Get User's Feed Posts
// @route     DELETE /posts/feed/:postId/
// @access    Private

export const deletePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const user = await getAuthUser(req, next);
  const userId = user._id;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse(`Post Not Found`, 404));
  }

  if (post.user.toString() !== userId.toString()) {
    return next(
      new ErrorResponse(`You are not authorized to delete this post`, 403)
    );
  }

  await Post.findByIdAndDelete(postId);

  baseResponseHandler({
    message: `Post Deleted Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: post,
  });
});

// @desc    Add post to playlist
// @route   PATCH /api/v1/feed/posts/:postId/playlist/:playlistId
// @access  Private

export const addPostToPlaylist = asyncHandler(async (req, res, next) => {
  const { postId, playlistId } = req.params;
  const user = await getAuthUser(req, next);

  const playlist = await Playlist.findOne({ _id: playlistId, user: user._id });
  if (!playlist) {
    return next(new ErrorResponse("Playlist not found or unauthorized", 404));
  }

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  if (playlist.videos.includes(new Types.ObjectId(postId))) {
    return next(new ErrorResponse("Post already in playlist", 400));
  }

  playlist.videos.push(new Types.ObjectId(postId));
  await playlist.save();

  baseResponseHandler({
    message: "Post added to playlist successfully",
    res,
    statusCode: 200,
    success: true,
    data: playlist,
  });
});

// @desc      Get User's Feed Posts
// @route     GET /posts/feed/search?searchTerm=keyword
// @access    Private

export const searchPosts = asyncHandler(async (req, res, next) => {
  const {
    searchTerm,
    page = 1,
    limit = 10,
  } = req.query as {
    searchTerm?: string;
    page?: string;
    limit?: string;
  };

  const searchQuery = searchTerm?.trim();
  const filter: any = {};

  // Prepare list of OR filters
  const orFilters: any[] = [];

  let matchingUsersAccounts;

  if (searchQuery) {
    // 1. Search for users whose names match the searchTerm
    const matchingUsers = await User.find({
      $or: [
        { firstName: { $regex: searchQuery, $options: "i" } },
        { lastName: { $regex: searchQuery, $options: "i" } },
        { username: { $regex: searchQuery, $options: "i" } },
        { displayName: { $regex: searchQuery, $options: "i" } },
      ],
    }).select("_id");

    matchingUsersAccounts = await User.find({
      $or: [
        { firstName: { $regex: searchQuery, $options: "i" } },
        { lastName: { $regex: searchQuery, $options: "i" } },
        { username: { $regex: searchQuery, $options: "i" } },
        { displayName: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .populate("firstName lastName username displayName")
      .select("-password");

    const userIds = matchingUsers.map((user) => user._id);

    orFilters.push(
      { category: { $regex: searchQuery, $options: "i" } },
      { description: { $regex: searchQuery, $options: "i" } },
      { tags: { $in: [new RegExp(searchQuery, "i")] } },
      { "comments.text": { $regex: searchQuery, $options: "i" } },
      { "comments.replies.text": { $regex: searchQuery, $options: "i" } }
    );

    // If there are matching users, include their IDs in the filter
    if (userIds.length > 0) {
      orFilters.push({ user: { $in: userIds } });
    }
  }

  // Only public posts
  filter.visibility = "public";

  if (orFilters.length > 0) {
    filter.$or = orFilters;
  }

  const options = getPaginateOptions(page, limit, {
    populate: [
      {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    ],
  });

  const postsData = await Post.paginate(filter, options);
  const posts = transformPaginateResponse(postsData);

  baseResponseHandler({
    message: `Search Results for "${searchQuery}"`,
    res,
    statusCode: 200,
    success: true,
    // data: postsWithUserAccounts,
    data: {
      posts,
      accounts: matchingUsersAccounts,
    },
  });
});

// @desc      Get Viral Posts
// @route     GET /api/v1/feed/viral
// @access    Private

export const getViralPosts = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;
  const user = await getAuthUser(req, next);

  // Calculate exactly 30 days ago
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const aggregatePipeline = [
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
        visibility: "public",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },

    {
      $addFields: {
        likesCount: { $size: "$reactions.likes" },
        commentsCount: { $size: "$comments" },
        user: {
          username: "$user.username",
          firstName: "$user.firstName",
          lastName: "$user.lastName",
          profilePicture: "$user.profilePicture",
        },
      },
    },
    {
      $sort: {
        likesCount: -1,
        commentsCount: -1,
      },
    },
  ] as unknown as mongoose.PipelineStage[];

  const options = getPaginateOptions(page, limit, {
    populate: [
      {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    ],
  });

  const posts = await Post.aggregate(aggregatePipeline)
    .skip(options.page)
    .limit(options.limit);

  const totalDocs = await Post.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
    visibility: "public",
  });

  // Get user's bookmarks for these posts
  const bookmarks = await Bookmark.find({
    user: user._id,
    post: { $in: posts.map((post) => post._id) },
  });

  const bookmarkedPostIds = new Set(bookmarks.map((b) => b.post.toString()));

  // Transform the posts with consistent structure
  const transformedPosts = posts.map((post) => ({
    _id: post._id,
    user: {
      _id: post.user._id,
      username: post.user.username,
      firstName: post.user.firstName,
      lastName: post.user.lastName,
      profilePicture: post.user.profilePicture,
    },
    category: post.category,
    thumbnail: post.thumbnail,
    videoUrl: post.videoUrl,
    description: post.description,
    visibility: post.visibility,
    tags: post.tags,
    isCommentsAllowed: post.isCommentsAllowed,
    reactions: post.reactions,
    comments: post.comments,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    isBookmarked: bookmarkedPostIds.has(post._id.toString()),
    metrics: {
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
    },
  }));

  const paginatedResponse = {
    docs: transformedPosts,
    totalDocs,
    limit: Number(options.limit),
    page: Number(options.page),
    totalPages: Math.ceil(totalDocs / Number(options.limit)),
  };

  baseResponseHandler({
    message: "Viral posts retrieved successfully",
    res,
    statusCode: 200,
    success: true,
    data: transformPaginateResponse(paginatedResponse),
  });
});

// @desc    Mark post as not interested
// @route   POST /api/v1/feed/posts/:postId/not-interested
// @access  Private

export const toggleNotInterested = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const user = await getAuthUser(req, next);

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  const existingNotInterested = await NotInterestedModel.findOne({
    user: user._id,
    post: postId,
  });

  if (existingNotInterested) {
    await NotInterestedModel.deleteOne({ _id: existingNotInterested._id });
    baseResponseHandler({
      message: "Post removed from not interested",
      res,
      statusCode: 200,
      success: true,
      data: { status: "removed" },
    });
  } else {
    const notInterested = await NotInterestedModel.create({
      user: user._id,
      post: postId,
    });
    baseResponseHandler({
      message: "Post marked as not interested",
      res,
      statusCode: 200,
      success: true,
      data: { status: "added", notInterested },
    });
  }
});

// @desc    Block channel from recommendations
// @route   POST /api/v1/feed/channels/:channelId/block
// @access  Private

export const blockChannel = asyncHandler(async (req, res, next) => {
  const { channelId } = req.params;
  const user = await getAuthUser(req, next);

  const channelUser = await User.findById(channelId);
  if (!channelUser) {
    return next(new ErrorResponse("Channel not found", 404));
  }

  const blockedChannel = await BlockedChannel.create({
    user: user._id,
    blockedUser: channelId,
  });

  baseResponseHandler({
    message: "Channel blocked from recommendations",
    res,
    statusCode: 200,
    success: true,
    data: blockedChannel,
  });
});

// @desc    Remove post from playlist
// @route   DELETE /api/v1/feed/posts/:postId/playlist/:playlistId
// @access  Private

export const removePostFromPlaylist = asyncHandler(async (req, res, next) => {
  const { postId, playlistId } = req.params;
  const user = await getAuthUser(req, next);

  const playlist = await Playlist.findOne({ _id: playlistId, user: user._id });
  if (!playlist) {
    return next(new ErrorResponse("Playlist not found or unauthorized", 404));
  }

  if (!playlist.videos.includes(new Types.ObjectId(postId))) {
    return next(new ErrorResponse("Post not in playlist", 404));
  }

  playlist.videos = playlist.videos.filter(
    (videoId) => videoId.toString() !== postId
  );
  await playlist.save();

  baseResponseHandler({
    message: "Post removed from playlist successfully",
    res,
    statusCode: 200,
    success: true,
    data: playlist,
  });
});

// @desc    Unblock channel from recommendations
// @route   DELETE /api/v1/feed/channels/:channelId/block
// @access  Private

export const unblockChannel = asyncHandler(async (req, res, next) => {
  const { channelId } = req.params;
  const user = await getAuthUser(req, next);

  const blockedChannel = await BlockedChannel.findOne({
    user: user._id,
    blockedUser: channelId,
  });

  if (!blockedChannel) {
    return next(new ErrorResponse("Channel not blocked", 404));
  }

  await BlockedChannel.deleteOne({ _id: blockedChannel._id });

  baseResponseHandler({
    message: "Channel unblocked successfully",
    res,
    statusCode: 200,
    success: true,
    data: { status: "unblocked" },
  });
});
