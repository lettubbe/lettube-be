"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SubscriptionSchema = new mongoose_1.default.Schema({
    subscriber: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subscribedTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
// Ensure a user cannot subscribe to the same person multiple times
SubscriptionSchema.index({ subscriber: 1, subscribedTo: 1 }, { unique: true });
const Subscription = mongoose_1.default.model("Subscription", SubscriptionSchema);
exports.default = Subscription;
