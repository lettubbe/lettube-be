"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: [true],
    },
    categories: [String],
    thumbnail: {
        type: String,
        required: [true, "Thumbnail is required"]
    },
    videoUrl: {
        type: String,
        required: [true, "Thumbnail is required"]
    },
    reactions: {}
});
const Post = (0, mongoose_1.model)("post", postSchema);
exports.default = Post;
