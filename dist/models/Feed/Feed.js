"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FeedSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: [true],
    },
    categories: [String],
    excludedCategories: [String],
    notInstrested: [String],
}, { timestamps: true });
const Feed = (0, mongoose_1.model)("feed", FeedSchema);
exports.default = Feed;
