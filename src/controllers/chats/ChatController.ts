import asyncHandler from "express-async-handler";
import { Message } from "../../models/chats/Conversations";
import ErrorResponse from "../../messages/ErrorResponse";
import baseResponseHandler from "../../messages/BaseResponseHandler";

export const deleteChatMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;

  // Check if messageId is provided
  if (!messageId) {
    return next(new ErrorResponse(`Message id is required`, 404));
  }

  // Find and update the message
  const message = await Message.findByIdAndUpdate(
    messageId,
    { isDeleted: true },
    { new: true }
  );

  // Check if message exists
  if (!message) {
    return next(new ErrorResponse(`Message is required`, 404));
  }

  baseResponseHandler({
    message: `Message deleted successfully`,
    res,
    statusCode: 201,
    success: true,
    data: message
  });

});
