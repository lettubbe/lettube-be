"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const SubscriptionSchema = new mongoose_1.Schema({
    subscriber: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    subscribedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { timestamps: true });
SubscriptionSchema.plugin(mongoose_paginate_v2_1.default);
// Ensure a user cannot subscribe to the same person multiple times
SubscriptionSchema.index({ subscriber: 1, subscribedTo: 1 }, { unique: true });
const Subscription = (0, mongoose_1.model)("Subscription", SubscriptionSchema);
exports.default = Subscription;
