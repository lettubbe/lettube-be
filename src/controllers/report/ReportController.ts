import asyncHandler from "express-async-handler";
import Report, { ReportCategory } from "../../models/Feed/Report";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import ErrorResponse from "../../messages/ErrorResponse";
import { getAuthUser } from "../../lib/utils/utils";
import Post from "../../models/Feed/Post";

// @desc    Create a report
// @route   POST /api/v1/reports
// @access  Private
export const createReport = asyncHandler(async (req, res, next) => {
  const { postId, category, reason } = req.body;
  const user = await getAuthUser(req, next);

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  const existingReport = await Report.findOne({
    user: user._id,
    post: postId
  });

  if (existingReport) {
    return next(new ErrorResponse('You have already reported this post', 400));
  }

  const report = await Report.create({
    user: user._id,
    post: postId,
    category,
    reason
  });

  baseResponseHandler({
    message: 'Report submitted successfully',
    res,
    statusCode: 201,
    success: true,
    data: report
  });
});

// @desc    Get user's reports
// @route   GET /api/v1/reports
// @access  Private
export const getUserReports = asyncHandler(async (req, res, next) => {
  const user = await getAuthUser(req, next);

  const reports = await Report.find({ user: user._id })
    .populate('post', 'title description')
    .sort('-createdAt');

  baseResponseHandler({
    message: 'Reports retrieved successfully',
    res,
    statusCode: 200,
    success: true,
    data: reports
  });
});