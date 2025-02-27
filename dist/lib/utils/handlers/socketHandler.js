"use strict";
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ChatController_1 = __importDefault(require("../../../controllers/chats/ChatController"));
const Conversations_1 = require("../../../models/Conversations");
const mongoose_1 = __importDefault(require("mongoose"));
const onlineUsers = new Set();
const userSockets = {}; // A map of user IDs to socket IDs
const socketHandler = (io) => {
    console.log("socket handler ran");
    io.on("connection", (socket) => {
        var _a;
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
        const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.data;
        console.log("token", token);
        if (token) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
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
                socket.on("message", (data) => __awaiter(void 0, void 0, void 0, function* () {
                    try {
                        const savedMessage = yield ChatController_1.default.save(data.message, data.sender);
                        io.emit("message", savedMessage);
                    }
                    catch (error) {
                        console.error("Error handling message event:", error);
                        socket.emit("error", { message: "Failed to save message" });
                    }
                }));
                // socket.emit("previousMessages", conversations);
                socket.on("getPreviousMessages", (_a) => __awaiter(void 0, [_a], void 0, function* ({ receiverId }) {
                    console.log("this ran prev messages");
                    try {
                        const conversations = yield Conversations_1.Conversation.findOne({
                            $or: [
                                { sender: decoded.id, receiver: receiverId },
                                { sender: receiverId, receiver: decoded.id },
                            ],
                        }).populate("messages");
                        console.log("conversations", conversations);
                        const messages = conversations ? conversations.messages : [];
                        console.log("messages", messages);
                        socket.emit("previousMessages", messages);
                    }
                    catch (error) {
                        console.error("Error fetching previous messages:", error);
                    }
                }));
                // Listen for chat messages
                socket.on("chat", (data) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log("Chat data received:", data);
                    const { sender, receiver, text, userId } = data;
                    // Validate sender and receiver
                    if (!mongoose_1.default.Types.ObjectId.isValid(sender) ||
                        !mongoose_1.default.Types.ObjectId.isValid(receiver)) {
                        console.error("Invalid sender or receiver ID");
                        return;
                    }
                    try {
                        // Create new message
                        const newMessage = new Conversations_1.Message({
                            text,
                            userId,
                        });
                        yield newMessage.save();
                        // Check if conversation exists
                        let conversation = yield Conversations_1.Conversation.findOne({
                            $or: [
                                { sender, receiver },
                                { sender: receiver, receiver: sender },
                            ],
                        });
                        if (!conversation) {
                            // Create new conversation if it doesn't exist
                            conversation = new Conversations_1.Conversation({
                                sender,
                                receiver,
                                messages: [newMessage._id],
                            });
                        }
                        else {
                            // Add message to existing conversation
                            conversation.messages.push(newMessage._id);
                        }
                        yield conversation.save();
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
        // socket.on("disconnect", () => {
        //   console.log(`User disconnected: ${socket.id}`);
        // });
    });
};
const getSocketIdForUser = (userId) => {
    // console.log("userId", userId);
    // console.log("userSockets[userId]", userSockets[userId]);
    return userSockets[userId];
};
exports.getSocketIdForUser = getSocketIdForUser;
exports.default = socketHandler;
