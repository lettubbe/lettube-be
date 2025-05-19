"use strict";
// import jwt from "jsonwebtoken";
// import { Server, Socket } from "socket.io";
// import { Conversation, Message } from "../../../models/Conversations";
// import mongoose from "mongoose";
// import chatService from "../../../services/chatService";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketIdForUser = void 0;
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const chatService_1 = __importDefault(require("../../../services/chatService"));
const Discussions_1 = __importStar(require("../../../models/chats/Discussions"));
const mongoose_1 = __importDefault(require("mongoose"));
const onlineUsers = new Set();
const userSockets = {};
const socketHandler = (io) => {
    console.log("socket handler ran");
    io.on("connection", (socket) => {
        var _a;
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
        const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.data;
        if (token) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                socket.join(decoded.id);
                onlineUsers.add(decoded.id);
                // Emit updated online users to all clients
                io.emit("onlineUser", Array.from(onlineUsers));
                socket.on("message", (data) => __awaiter(void 0, void 0, void 0, function* () {
                    try {
                        const savedMessage = yield chatService_1.default.save(data.message, data.sender);
                        io.emit("message", savedMessage);
                    }
                    catch (error) {
                        console.error("Error handling message event:", error);
                        socket.emit("error", { message: "Failed to save message" });
                    }
                }));
                socket.on("getPreviousMessages", (_a) => __awaiter(void 0, [_a], void 0, function* ({ receiverId }) {
                    try {
                        const messages = yield chatService_1.default.getPreviousMessages(decoded.id, receiverId);
                        socket.emit("previousMessages", messages);
                    }
                    catch (error) {
                        console.error("Error fetching previous messages:", error);
                    }
                }));
                socket.on("chat", (data) => __awaiter(void 0, void 0, void 0, function* () {
                    const { sender, receiver, text, userId } = data;
                    try {
                        const { newMessage } = yield chatService_1.default.saveChat({
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
                    }
                    catch (error) {
                        console.error("Error saving chat message:", error);
                    }
                }));
                socket.on("getPreviousGroupMessages", (_a) => __awaiter(void 0, [_a], void 0, function* ({ groupId, discussionId }) {
                    console.log("this ran prev messages", { groupId, discussionId });
                    try {
                        const messages = yield chatService_1.default.getPreviousGroupMessages(groupId, discussionId);
                        socket.emit("previousGroupMessages", messages);
                    }
                    catch (error) {
                        console.error("Error fetching previous messages:", error);
                    }
                }));
                socket.on("joinGroup", (groupId) => {
                    chatService_1.default.joinGroup(socket, groupId);
                });
                socket.on("deleteGroupMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ messageId, groupId }) {
                    try {
                        yield chatService_1.default.deleteGroupMessage(messageId, groupId, io);
                    }
                    catch (error) {
                        console.error("Error deleting message:", error.message);
                    }
                }));
                socket.on("GroupChat", (data) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log("Chat data received:", data);
                    try {
                        yield chatService_1.default.handleGroupChat(data, io);
                    }
                    catch (error) {
                        console.error("Error saving chat message:", error.message);
                    }
                }));
                socket.on("deleteGroupMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ messageId, groupId }) {
                    try {
                        if (!mongoose_1.default.Types.ObjectId.isValid(messageId)) {
                            console.error("Invalid messageId");
                            return;
                        }
                        // Find the message and mark it as deleted (soft delete)
                        const message = yield Discussions_1.GroupMessage.findByIdAndUpdate(messageId, { isDeleted: true }, { new: true }).populate("userId");
                        if (!message) {
                            console.error("Message not found");
                            return;
                        }
                        console.log("Message deleted:", message);
                        // Broadcast the deletion event to all users in the group
                        io.to(groupId).emit("groupMessageDeleted", { messageId, groupId });
                    }
                    catch (error) {
                        console.error("Error deleting message:", error);
                    }
                }));
                socket.on("GroupChat", (data) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log("Chat data received:", data);
                    const { sender, groupId, text, userId, discussionId, repliedTo } = data;
                    if (!mongoose_1.default.Types.ObjectId.isValid(sender) ||
                        !mongoose_1.default.Types.ObjectId.isValid(groupId)) {
                        console.error("Invalid sender or groupId");
                        return;
                    }
                    try {
                        let discussion = yield Discussions_1.default.findOne({
                            _id: discussionId,
                            group: groupId,
                        }).populate("comments");
                        const newMessage = new Discussions_1.GroupMessage({
                            text,
                            userId,
                            repliedTo: repliedTo
                                ? new mongoose_1.default.Types.ObjectId(repliedTo)
                                : null, // Store replied message ID
                        });
                        yield newMessage.save();
                        if (!discussion) {
                            discussion = new Discussions_1.default({
                                group: groupId,
                                user: sender,
                                content: "New discussion",
                                comments: [newMessage._id],
                            });
                        }
                        else {
                            discussion.comments.push(newMessage._id);
                        }
                        yield discussion.save();
                        const savedMessage = yield newMessage.populate("userId repliedTo");
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
                    }
                    catch (error) {
                        console.error("Error saving chat message:", error);
                    }
                }));
                socket.on("disconnect", () => {
                    console.log("User disconnected:", socket.id);
                    onlineUsers.delete(decoded.id);
                    // Emit updated online users after a disconnect
                    io.emit("onlineUser", Array.from(onlineUsers));
                });
            }
            catch (error) {
                console.error("Invalid token:", error);
                // socket.disconnect(true);
            }
        }
        else {
            console.log("No token provided, disconnecting user...");
            // socket.disconnect(true);
        }
    });
};
const getSocketIdForUser = (userId) => {
    // console.log("userId", userId);
    // console.log("userSockets[userId]", userSockets[userId]);
    return userSockets[userId];
};
exports.getSocketIdForUser = getSocketIdForUser;
exports.default = socketHandler;
