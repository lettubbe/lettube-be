"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    text: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    },
    videoUrl: {
        type: String,
        default: ""
    },
    seen: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Sender is required"],
        ref: "user"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const conversationSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Sender is required"],
        ref: "user"
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Sender is required"],
        ref: "user"
    },
    messages: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "message" }
    ],
}, { timestamps: true });
exports.Message = (0, mongoose_1.model)("message", messageSchema);
exports.Conversation = (0, mongoose_1.model)("conversation", conversationSchema);
