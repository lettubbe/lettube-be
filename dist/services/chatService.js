"use strict";
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
const Conversations_1 = require("../models/chats/Conversations");
const mongoose_1 = __importDefault(require("mongoose"));
const Discussions_1 = __importStar(require("../models/chats/Discussions"));
class ChatService {
    save(message, sender) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatMessage = new Conversations_1.Message({ text: message, userId: sender });
            return chatMessage.save();
        });
    }
    saveChat(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sender, receiver, text, userId, }) {
            if (!mongoose_1.default.Types.ObjectId.isValid(sender) ||
                !mongoose_1.default.Types.ObjectId.isValid(receiver)) {
                throw new Error("Invalid sender or receiver ID");
            }
            const newMessage = new Conversations_1.Message({ text, userId });
            yield newMessage.save();
            let conversation = yield Conversations_1.Conversation.findOne({
                $or: [
                    { sender, receiver },
                    { sender: receiver, receiver: sender },
                ],
            });
            if (!conversation) {
                conversation = new Conversations_1.Conversation({
                    sender,
                    receiver,
                    messages: [newMessage._id],
                });
            }
            else {
                conversation.messages.push(newMessage._id);
            }
            yield conversation.save();
            return { newMessage, conversation };
        });
    }
    getPreviousMessages(userId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield Conversations_1.Conversation.findOne({
                $or: [
                    { sender: userId, receiver: receiverId },
                    { sender: receiverId, receiver: userId },
                ],
            }).populate("messages");
            return (conversation === null || conversation === void 0 ? void 0 : conversation.messages) || [];
        });
    }
    getPreviousGroupMessages(groupId, discussionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield Discussions_1.default.findOne({
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
            return (discussion === null || discussion === void 0 ? void 0 : discussion.comments) || [];
        });
    }
    deleteGroupMessage(messageId, groupId, io) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(messageId)) {
                throw new Error("Invalid messageId");
            }
            const message = yield Discussions_1.GroupMessage.findByIdAndUpdate(messageId, { isDeleted: true }, { new: true }).populate("userId");
            if (!message) {
                throw new Error("Message not found");
            }
            console.log("Message deleted:", message);
            io.to(groupId).emit("groupMessageDeleted", { messageId, groupId });
            return message;
        });
    }
    joinGroup(socket, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`✅ User ${socket.id} joined group: ${groupId}`);
            socket.join(groupId);
        });
    }
    handleGroupChat(data, io) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sender, groupId, text, userId, discussionId, repliedTo } = data;
            if (!mongoose_1.default.Types.ObjectId.isValid(sender) ||
                !mongoose_1.default.Types.ObjectId.isValid(groupId)) {
                throw new Error("Invalid sender or groupId");
            }
            let discussion = yield Discussions_1.default.findOne({
                _id: discussionId,
                group: groupId,
            }).populate("comments");
            const newMessage = new Discussions_1.GroupMessage({
                text,
                userId,
                repliedTo: repliedTo ? new mongoose_1.default.Types.ObjectId(repliedTo) : null,
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
            io.to(groupId).emit("newGroupMessage", {
                _id: savedMessage._id,
                text: savedMessage.text,
                userId: savedMessage.userId,
                createdAt: savedMessage.createdAt,
                repliedTo: savedMessage.repliedTo,
            });
            return savedMessage;
        });
    }
}
exports.default = new ChatService();
