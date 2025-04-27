"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const postSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    category: String,
    thumbnail: {
        type: String,
        required: [true, "Thumbnail is required"],
    },
    videoUrl: {
        type: String,
        required: [true, "Video URL is required"],
    },
    description: {
        type: String,
    },
    visibility: {
        type: String,
        enum: ["public", "private", "subscribers"]
    },
    tags: {
        type: [String]
    },
    isCommentsAllowed: {
        type: Boolean,
        default: true
    },
    reactions: {
        likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "user" }],
        dislikes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "user" }],
        shares: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
    },
    comments: [
        {
            user: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
            text: { type: String, required: true },
            likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "user" }],
            replies: [
                {
                    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
                    text: { type: String, required: true },
                    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "user" }],
                    createdAt: { type: Date, default: Date.now },
                },
            ],
            createdAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });
postSchema.plugin(mongoose_paginate_v2_1.default);
const Post = (0, mongoose_1.model)("post", postSchema);
exports.default = Post;
