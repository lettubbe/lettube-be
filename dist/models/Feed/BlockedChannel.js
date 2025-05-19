"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BlockedChannelSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    blockedUser: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, { timestamps: true });
const BlockedChannel = (0, mongoose_1.model)("blockedChannel", BlockedChannelSchema);
exports.default = BlockedChannel;
