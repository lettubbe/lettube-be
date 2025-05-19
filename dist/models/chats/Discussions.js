"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMessage = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const GroupMessageSchema = new mongoose_1.Schema({
    text: {
        type: String,
        default: "",
    },
    imageUrl: {
        type: String,
        default: "",
    },
    videoUrl: {
        type: String,
        default: "",
    },
    seen: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Sender is required"],
        ref: "User",
    },
    repliedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "groupMessages",
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const DiscussionSchema = new mongoose_1.Schema({
    group: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "group",
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: [true, "Content is required"],
    },
    reactions: {
        likes: {
            type: Number,
            default: 0,
        },
        shares: {
            type: Number,
            default: 0,
        },
        likedBy: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    comments: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "groupMessages" }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});
// Add pagination
DiscussionSchema.plugin(mongoose_paginate_v2_1.default);
exports.GroupMessage = (0, mongoose_1.model)("groupMessages", GroupMessageSchema);
const Discussion = (0, mongoose_1.model)("discussion", DiscussionSchema);
exports.default = Discussion;
