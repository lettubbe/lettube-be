import asyncHandler from "express-async-handler";
import { Message } from "../../models/Conversations";
import ErrorResponse from "../../messages/ErrorResponse";

export const deleteChatMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;

  // Check if messageId is provided
  if (!messageId) {
    return next(new ErrorResponse(`Message id is required`, 404));
  }

  // Find and update the message
  const message = await Message.findByIdAndUpdate(
    messageId,
    { isDeleted: true }, // Optionally, update text
    { new: true }
  );

  // Check if message exists
  if (!message) {
    return next(new ErrorResponse(`Message is required`, 404));
  }

  res.status(200).json({ message: "Message deleted successfully", data: message });
});
