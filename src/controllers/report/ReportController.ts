import asyncHandler from "express-async-handler";
import Report, { ReportCategory, ReportType } from "../../models/Feed/Report";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import ErrorResponse from "../../messages/ErrorResponse";
import { getAuthUser } from "../../lib/utils/utils";
import Post from "../../models/Feed/Post";
import User from "../../models/Auth/User";
import { ObjectId } from "mongoose";

// @desc    Create a report
// @route   POST /api/v1/reports
// @access  Private
export const createReport = asyncHandler(async (req, res, next) => {
  const { id, category, reason, type } = req.body;
  const user = await getAuthUser(req, next);

  if (!type || !Object.values(ReportType).includes(type)) {
    return next(new ErrorResponse('Invalid report type', 400));
  }

  let existingReport;
  if (type === ReportType.POST) {
    const post = await Post.findById(id);
    if (!post) {
      return next(new ErrorResponse('Post not found', 404));
    }

    existingReport = await Report.findOne({
      user: user._id,
      post: id,
      type: ReportType.POST
    });
  } else {
    const channel = await User.findById(id);
    if (!channel) {
      return next(new ErrorResponse('Channel not found', 404));
    }

    existingReport = await Report.findOne({
      user: user._id,
      channel: id,
      type: ReportType.CHANNEL
    });
  }

  if (existingReport) {
    return next(new ErrorResponse(`You have already reported this ${type}`, 400));
  }

  const reportData = {
    user: user._id,
    category,
    reason,
    type,
    post: undefined,
    channel: undefined
  };

  if (type === ReportType.POST) {
    reportData.post = id;
  } else {
    reportData.channel = id;
  }

  const report = await Report.create(reportData);

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
  const { type } = req.query;

  let query: { user: ObjectId, type?: ReportType } = { user: user._id };
  if (type && Object.values(ReportType).includes(type as ReportType)) {
    query = { ...query, type: type as ReportType };
  }

  const reports = await Report.find(query)
    .populate('post', 'title description')
    .populate('channel', 'username email')
    .sort('-createdAt');

  baseResponseHandler({
    message: 'Reports retrieved successfully',
    res,
    statusCode: 200,
    success: true,
    data: reports
  });
});