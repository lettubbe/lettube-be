// import { model, Schema } from "mongoose";
// import { NotificationStatusEnum } from "../constants/enums/NotificationEnums";

// const notificationSchema = new Schema({
//     user: {
//         type: Schema.Types.ObjectId,
//         ref: "user",
//         required: [true]
//     },
//     type: {
//         type: String,
//         required: [true, "Notification Type is required"]
//     },
//     status: {
//         type: String,
//         default: NotificationStatusEnum.UNREAD
//     },
//     title: {
//         type: String,
//         required: [true, "Notification Title is required"]
//     },
//     description: {
//         type: String,
//         required: [true, "Notification Description is required"]
//     },
//     link: {
//         type: Boolean,
//     },
//     notificationType: {
//         type: String
//     },
//     date: {
//         type: String,
//         default: Date.now()
//     }
// }, { timestamps: true });

// const Notification = model("notification", notificationSchema);

// export default Notification;

import mongoose, { Schema, Document, Model,model, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const NotificationSchema: Schema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  actorIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  type: {
    type: String,
    enum: ["like", "comment", "reply", "subscription"],
    required: true,
  },
  videoId: { type: Schema.Types.ObjectId, ref: "Video", default: null },
  commentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  text: { type: String },
  metadata: { type: Schema.Types.Mixed },
  read: { type: Boolean, default: false },
}, { timestamps: true });

NotificationSchema.plugin(mongoosePaginate);

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId; 
  actorIds: mongoose.Types.ObjectId[]; 
  type: "like" | "comment" | "reply" | "subscription"; 
  videoId?: mongoose.Types.ObjectId; 
  commentId?: mongoose.Types.ObjectId;
  text?: string; 
  createdAt: Date;
  read: boolean;
  metadata?: Record<string, any>; 
}

export interface INotificationModel extends Model<INotification> {
  paginate(
    query: object,
    options: object
  ): Promise<{
    docs: INotification[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  }>;
}

export const Notification = mongoose.model<INotification, INotificationModel>(
  "notification",
  NotificationSchema
);

export default Notification;