import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { Conversation, Message } from "../../../models/Conversations";
import mongoose from "mongoose";
import chatService from "../../../services/chatService";

const onlineUsers = new Set<string>();
const userSockets = {} as any; // A map of user IDs to socket IDs

const socketHandler = (io: Server) => {
  console.log("socket handler ran");
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("register", (userId) => {
      // console.log("register socket ran", userId);
      userSockets[userId] = socket.id;
      console.log("userSockets", userSockets);
    });

    socket.on("disconnect", () => {
      // console.log("socket disconnect ran");
      for (const userId in userSockets) {
        if (userSockets[userId] === socket.id) {
          delete userSockets[userId];
        }
      }
    });
    
    const token = socket.handshake.auth?.data;

    console.log("token", token);

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as any;

        socket.join(decoded.id);
        onlineUsers.add(decoded.id);

        // Emit updated online users to all clients
        io.emit("onlineUser", Array.from(onlineUsers));

        // const conversations = await Conversation.find({
        //     $or: [
        //         { sender: decoded.id },
        //         { receiver: decoded.id }
        //     ]
        // }).populate("messages");

        // console.log("conversations", conversations);
    
        socket.on("message", async (data) => {
          try {
            const savedMessage = await chatService.save(
              data.message,
              data.sender
            );
            io.emit("message", savedMessage);
          } catch (error) {
            console.error("Error handling message event:", error);
            socket.emit("error", { message: "Failed to save message" });
          }
        });

        // socket.emit("previousMessages", conversations);
        socket.on("getPreviousMessages", async ({ receiverId }) => {
          console.log("this ran prev messages");
          try {
            const conversations = await Conversation.findOne({
              $or: [
                { sender: decoded.id, receiver: receiverId },
                { sender: receiverId, receiver: decoded.id },
              ],
            }).populate("messages");

            console.log("conversations", conversations);

            const messages = conversations ? conversations.messages : [];

            console.log("messages", messages);

            socket.emit("previousMessages", messages);
          } catch (error) {
            console.error("Error fetching previous messages:", error);
          }
        });

        // Listen for chat messages
        socket.on("chat", async (data) => {
          console.log("Chat data received:", data);

          const { sender, receiver, text, userId } = data;

          // Validate sender and receiver
          if (
            !mongoose.Types.ObjectId.isValid(sender) ||
            !mongoose.Types.ObjectId.isValid(receiver)
          ) {
            console.error("Invalid sender or receiver ID");
            return;
          }

          try {
            // Create new message
            const newMessage = new Message({
              text,
              userId,
            });

            await newMessage.save();

            // Check if conversation exists
            let conversation = await Conversation.findOne({
              $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
              ],
            });

            if (!conversation) {
              // Create new conversation if it doesn't exist
              conversation = new Conversation({
                sender,
                receiver,
                messages: [newMessage._id],
              });
            } else {
              // Add message to existing conversation
              conversation.messages.push(newMessage._id);
            }

            await conversation.save();

            // Emit message to receiver's room
            io.to(receiver).emit("newMessage", {
              sender,
              receiver,
              text,
              messageId: newMessage._id,
            });

            // io.to(sender).emit("newMessage", {
            //     sender,
            //     receiver,
            //     text,
            //     messageId: newMessage._id
            // });

            console.log("Message saved and emitted");
          } catch (error) {
            console.error("Error saving chat message:", error);
          }
        });

        socket.on("disconnect", () => {
          console.log("User disconnected:", socket.id);
          onlineUsers.delete(decoded.id);

          // Emit updated online users after a disconnect
          io.emit("onlineUser", Array.from(onlineUsers));
        });
      } catch (error) {
        console.error("Invalid token:", error);
        // socket.disconnect(true);
      }
    } else {
      console.log("No token provided, disconnecting user...");
      // socket.disconnect(true);
    }

    // socket.on("disconnect", () => {
    //   console.log(`User disconnected: ${socket.id}`);
    // });
  });
};

export const getSocketIdForUser = (userId: any) => {
  // console.log("userId", userId);
  // console.log("userSockets[userId]", userSockets[userId]);
  return userSockets[userId];
};

export default socketHandler;
