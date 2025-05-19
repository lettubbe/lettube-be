// import jwt from "jsonwebtoken";
// import { Server, Socket } from "socket.io";
// import { Conversation, Message } from "../../../models/Conversations";
// import mongoose from "mongoose";
// import chatService from "../../../services/chatService";

// const onlineUsers = new Set<string>();
// const userSockets = {} as any; // A map of user IDs to socket IDs

// const socketHandler = (io: Server) => {
//   console.log("socket handler ran");
//   io.on("connection", (socket: Socket) => {
//     console.log(`User connected: ${socket.id}`);

//     socket.on("register", (userId) => {
//       // console.log("register socket ran", userId);
//       userSockets[userId] = socket.id;
//       console.log("userSockets", userSockets);
//     });

//     socket.on("disconnect", () => {
//       // console.log("socket disconnect ran");
//       for (const userId in userSockets) {
//         if (userSockets[userId] === socket.id) {
//           delete userSockets[userId];
//         }
//       }
//     });

//     const token = socket.handshake.auth?.data;

//     console.log("token", token);

//     if (token) {
//       try {
//         const decoded = jwt.verify(
//           token,
//           process.env.JWT_SECRET as string
//         ) as any;

//         socket.join(decoded.id);
//         onlineUsers.add(decoded.id);

//         // Emit updated online users to all clients
//         io.emit("onlineUser", Array.from(onlineUsers));

//         // const conversations = await Conversation.find({
//         //     $or: [
//         //         { sender: decoded.id },
//         //         { receiver: decoded.id }
//         //     ]
//         // }).populate("messages");

//         // console.log("conversations", conversations);

//         socket.on("message", async (data) => {
//           try {
//             const savedMessage = await chatService.save(
//               data.message,
//               data.sender
//             );
//             io.emit("message", savedMessage);
//           } catch (error) {
//             console.error("Error handling message event:", error);
//             socket.emit("error", { message: "Failed to save message" });
//           }
//         });

//         // socket.emit("previousMessages", conversations);
//         socket.on("getPreviousMessages", async ({ receiverId }) => {
//           console.log("this ran prev messages");
//           try {
//             const conversations = await Conversation.findOne({
//               $or: [
//                 { sender: decoded.id, receiver: receiverId },
//                 { sender: receiverId, receiver: decoded.id },
//               ],
//             }).populate("messages");

//             console.log("conversations", conversations);

//             const messages = conversations ? conversations.messages : [];

//             console.log("messages", messages);

//             socket.emit("previousMessages", messages);
//           } catch (error) {
//             console.error("Error fetching previous messages:", error);
//           }
//         });

//         // Listen for chat messages
//         socket.on("chat", async (data) => {
//           console.log("Chat data received:", data);

//           const { sender, receiver, text, userId } = data;

//           // Validate sender and receiver
//           if (
//             !mongoose.Types.ObjectId.isValid(sender) ||
//             !mongoose.Types.ObjectId.isValid(receiver)
//           ) {
//             console.error("Invalid sender or receiver ID");
//             return;
//           }

//           try {
//             // Create new message
//             const newMessage = new Message({
//               text,
//               userId,
//             });

//             await newMessage.save();

//             // Check if conversation exists
//             let conversation = await Conversation.findOne({
//               $or: [
//                 { sender, receiver },
//                 { sender: receiver, receiver: sender },
//               ],
//             });

//             if (!conversation) {
//               // Create new conversation if it doesn't exist
//               conversation = new Conversation({
//                 sender,
//                 receiver,
//                 messages: [newMessage._id],
//               });
//             } else {
//               // Add message to existing conversation
//               conversation.messages.push(newMessage._id);
//             }

//             await conversation.save();

//             // Emit message to receiver's room
//             io.to(receiver).emit("newMessage", {
//               sender,
//               receiver,
//               text,
//               messageId: newMessage._id,
//             });

//             // io.to(sender).emit("newMessage", {
//             //     sender,
//             //     receiver,
//             //     text,
//             //     messageId: newMessage._id
//             // });

//             console.log("Message saved and emitted");
//           } catch (error) {
//             console.error("Error saving chat message:", error);
//           }
//         });

//         socket.on("disconnect", () => {
//           console.log("User disconnected:", socket.id);
//           onlineUsers.delete(decoded.id);

//           // Emit updated online users after a disconnect
//           io.emit("onlineUser", Array.from(onlineUsers));
//         });
//       } catch (error) {
//         console.error("Invalid token:", error);
//         // socket.disconnect(true);
//       }
//     } else {
//       console.log("No token provided, disconnecting user...");
//       // socket.disconnect(true);
//     }

//     // socket.on("disconnect", () => {
//     //   console.log(`User disconnected: ${socket.id}`);
//     // });
//   });
// };

// export const getSocketIdForUser = (userId: any) => {
//   // console.log("userId", userId);
//   // console.log("userSockets[userId]", userSockets[userId]);
//   return userSockets[userId];
// };

// export default socketHandler;

import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import chatService from "../../../services/chatService";
import Discussion, { GroupMessage } from "../../../models/chats/Discussions";
import mongoose, { Types } from "mongoose";

const onlineUsers = new Set<string>();
const userSockets = {} as any;

const socketHandler = (io: Server) => {
  console.log("socket handler ran");
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("register", (userId) => {
      userSockets[userId] = socket.id;
      console.log("userSockets", userSockets);
    });

    socket.on("disconnect", () => {
      for (const userId in userSockets) {
        if (userSockets[userId] === socket.id) {
          delete userSockets[userId];
        }
      }
    });

    const token = socket.handshake.auth?.data;

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

        socket.on("getPreviousMessages", async ({ receiverId }) => {
          try {
            const messages = await chatService.getPreviousMessages(
              decoded.id,
              receiverId
            );
            socket.emit("previousMessages", messages);
          } catch (error) {
            console.error("Error fetching previous messages:", error);
          }
        });

        socket.on("chat", async (data) => {
          const { sender, receiver, text, userId } = data;

          try {
            const { newMessage } = await chatService.saveChat({
              sender,
              receiver,
              text,
              userId,
            });

            io.to(receiver).emit("newMessage", {
              sender,
              receiver,
              text,
              messageId: newMessage._id,
            });

            console.log("Message saved and emitted");
          } catch (error) {
            console.error("Error saving chat message:", error);
          }
        });

        socket.on("getPreviousGroupMessages", async ({ groupId, discussionId }) => {
            console.log("this ran prev messages", { groupId, discussionId });
            try {
              const messages = await chatService.getPreviousGroupMessages(
                groupId,
                discussionId
              );
              socket.emit("previousGroupMessages", messages);
            } catch (error) {
              console.error("Error fetching previous messages:", error);
            }
          }
        );

        socket.on("joinGroup", (groupId) => {
          chatService.joinGroup(socket, groupId);
        });

        socket.on("deleteGroupMessage", async ({ messageId, groupId }) => {
          try {
            await chatService.deleteGroupMessage(messageId, groupId, io);
          } catch (error: any) {
            console.error("Error deleting message:", error.message);
          }
        });

        socket.on("GroupChat", async (data) => {
          console.log("Chat data received:", data);
          try {
            await chatService.handleGroupChat(data, io);
          } catch (error: any) {
            console.error("Error saving chat message:", error.message);
          }
        });

        socket.on("deleteGroupMessage", async ({ messageId, groupId }) => {
          try {
            if (!mongoose.Types.ObjectId.isValid(messageId)) {
              console.error("Invalid messageId");
              return;
            }

            // Find the message and mark it as deleted (soft delete)
            const message = await GroupMessage.findByIdAndUpdate(
              messageId,
              { isDeleted: true },
              { new: true }
            ).populate("userId");

            if (!message) {
              console.error("Message not found");
              return;
            }

            console.log("Message deleted:", message);

            // Broadcast the deletion event to all users in the group
            io.to(groupId).emit("groupMessageDeleted", { messageId, groupId });
          } catch (error) {
            console.error("Error deleting message:", error);
          }
        });

        socket.on("GroupChat", async (data) => {
          console.log("Chat data received:", data);

          const { sender, groupId, text, userId, discussionId, repliedTo } =
            data;

          if (
            !mongoose.Types.ObjectId.isValid(sender) ||
            !mongoose.Types.ObjectId.isValid(groupId)
          ) {
            console.error("Invalid sender or groupId");
            return;
          }

          try {
            let discussion = await Discussion.findOne({
              _id: discussionId,
              group: groupId,
            }).populate("comments");

            const newMessage = new GroupMessage({
              text,
              userId,
              repliedTo: repliedTo
                ? new mongoose.Types.ObjectId(repliedTo)
                : null, // Store replied message ID
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

            console.log("savedMessage", savedMessage);

            // Emit message with full details
            io.to(groupId).emit("newGroupMessage", {
              _id: savedMessage._id,
              text: savedMessage.text,
              userId: savedMessage.userId,
              createdAt: savedMessage.createdAt,
              repliedTo: savedMessage.repliedTo, 
            });

            console.log("Message saved and emitted:", savedMessage);
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
  });
};

export const getSocketIdForUser = (userId: any) => {
  // console.log("userId", userId);
  // console.log("userSockets[userId]", userSockets[userId]);
  return userSockets[userId];
};

export default socketHandler;
