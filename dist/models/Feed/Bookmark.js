"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const BookmarkSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "post",
        required: true,
    }
}, { timestamps: true });
// Create compound index for user and post to ensure uniqueness
BookmarkSchema.index({ user: 1, post: 1 }, { unique: true });
BookmarkSchema.plugin(mongoose_paginate_v2_1.default);
const Bookmark = (0, mongoose_1.model)("bookmark", BookmarkSchema);
exports.default = Bookmark;
