"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationEnums_1 = require("../constants/enums/NotificationEnums");
const notificationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: [true]
    },
    type: {
        type: String,
        // enum: ["transactions", "activities"],
        required: [true, "Notification Type is required"]
    },
    status: {
        type: String,
        default: NotificationEnums_1.NotificationStatusEnum.UNREAD
    },
    title: {
        type: String,
        required: [true, "Notification Title is required"]
    },
    description: {
        type: String,
        required: [true, "Notification Description is required"]
    },
    link: {
        type: Boolean,
    },
    notificationType: {
        type: String
    },
    date: {
        type: String,
        default: Date.now()
    }
}, { timestamps: true });
const Notification = (0, mongoose_1.model)("notification", notificationSchema);
exports.default = Notification;
