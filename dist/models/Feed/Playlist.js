"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const playlistSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Playlist name is required"],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: [true],
    },
    coverPhoto: {
        type: String,
        required: [true, "Cover is required"],
    },
    description: {
        type: String,
    },
    videos: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "post",
        }],
    visibility: {
        type: String,
        enum: ["private", "public"],
    },
}, { timestamps: true });
playlistSchema.plugin(mongoose_paginate_v2_1.default);
const Playlist = (0, mongoose_1.model)("playlist", playlistSchema);
exports.default = Playlist;
