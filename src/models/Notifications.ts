import { model, Schema } from "mongoose";
import { NotificationStatusEnum } from "../constants/enums/NotificationEnums";
import { boolean } from "joi";

const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
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
        default: NotificationStatusEnum.UNREAD
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

const Notification = model("notification", notificationSchema);

export default Notification;