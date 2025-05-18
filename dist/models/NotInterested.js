"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotInterestedSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "post",
        required: true
    }
}, { timestamps: true });
const NotInterested = (0, mongoose_1.model)("notInterested", NotInterestedSchema);
exports.default = NotInterested;
