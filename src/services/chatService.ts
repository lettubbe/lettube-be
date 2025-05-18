import { Conversation, Message } from "../models/chats/Conversations";
import mongoose from "mongoose";
import Discussion, { GroupMessage } from "../models/chats/Discussions";
import { Server, Socket } from "socket.io";

class ChatService {
  async save(message: string, sender: string) {
    const chatMessage = new Message({ text: message, userId: sender });
    return chatMessage.save();
  }

  async saveChat({
    sender,
    receiver,
    text,
    userId,
  }: {
    sender: string;
    receiver: string;
    text: string;
    userId: string;
  }) {
    if (
      !mongoose.Types.ObjectId.isValid(sender) ||
      !mongoose.Types.ObjectId.isValid(receiver)
    ) {
      throw new Error("Invalid sender or receiver ID");
    }

    const newMessage = new Message({ text, userId });
    await newMessage.save();

    let conversation = await Conversation.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    if (!conversation) {
      conversation = new Conversation({
        sender,
        receiver,
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
    }

    await conversation.save();

    return { newMessage, conversation };
  }

  async getPreviousMessages(userId: string, receiverId: string) {
    const conversation = await Conversation.findOne({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).populate("messages");

    return conversation?.messages || [];
  }

  async getPreviousGroupMessages(groupId: string, discussionId: string) {
    const discussion = await Discussion.findOne({
      _id: discussionId,
      group: groupId,
    }).populate({
      path: "comments",
      populate: [
        {
          path: "userId",
          model: "User",
        },
        {
          path: "repliedTo",
          model: "groupMessages",
          populate: {
            path: "userId",
            model: "User",
          },
        },
      ],
    });

    return discussion?.comments || [];
  }

  async deleteGroupMessage(messageId: string, groupId: string, io: Server) {
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      throw new Error("Invalid messageId");
    }

    const message = await GroupMessage.findByIdAndUpdate(
      messageId,
      { isDeleted: true },
      { new: true }
    ).populate("userId");

    if (!message) {
      throw new Error("Message not found");
    }

    console.log("Message deleted:", message);

    io.to(groupId).emit("groupMessageDeleted", { messageId, groupId });
    return message;
  }

  async joinGroup(socket: Socket, groupId: string) {
    console.log(`✅ User ${socket.id} joined group: ${groupId}`);
    socket.join(groupId);
  }

  async handleGroupChat(
    data: {
      sender: string;
      groupId: string;
      text: string;
      userId: string;
      discussionId: string;
      repliedTo?: string;
    },
    io: Server
  ) {
    const { sender, groupId, text, userId, discussionId, repliedTo } = data;

    if (
      !mongoose.Types.ObjectId.isValid(sender) ||
      !mongoose.Types.ObjectId.isValid(groupId)
    ) {
      throw new Error("Invalid sender or groupId");
    }

    let discussion = await Discussion.findOne({
      _id: discussionId,
      group: groupId,
    }).populate("comments");

    const newMessage = new GroupMessage({
      text,
      userId,
      repliedTo: repliedTo ? new mongoose.Types.ObjectId(repliedTo) : null,
    });

    await newMessage.save();

    if (!discussion) {
      discussion = new Discussion({
        group: groupId,
        user: sender,
        content: "New discussion",
        comments: [newMessage._id],
      });
    } else {
      discussion.comments.push(newMessage._id);
    }

    await discussion.save();

    const savedMessage = await newMessage.populate("userId repliedTo");

    io.to(groupId).emit("newGroupMessage", {
      _id: savedMessage._id,
      text: savedMessage.text,
      userId: savedMessage.userId,
      createdAt: savedMessage.createdAt,
      repliedTo: savedMessage.repliedTo,
    });

    return savedMessage;
  }
}

export default new ChatService();
