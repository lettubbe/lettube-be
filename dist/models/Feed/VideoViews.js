"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const VideoViewsSchema = new mongoose_1.default.Schema({
    views: {
        type: [String],
    },
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "post",
        required: true,
    },
}, { timestamps: true });
VideoViewsSchema.plugin(mongoose_paginate_v2_1.default);
const VideoView = mongoose_1.default.model("videoViews", VideoViewsSchema);
exports.default = VideoView;
