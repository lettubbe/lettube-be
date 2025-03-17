"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    categories: [String],
    thumbnail: {
        type: String,
        required: [true, "Thumbnail is required"],
    },
    videoUrl: {
        type: String,
        required: [true, "Video URL is required"],
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
            likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "user" }], // Users who liked the comment
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
const Post = (0, mongoose_1.model)("post", postSchema);
exports.default = Post;
