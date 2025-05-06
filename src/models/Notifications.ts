import mongoose, { Schema, Document, Model,model, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const NotificationSchema: Schema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  post: { type: Schema.Types.ObjectId, ref: "post" },
  actorIds: [{ type: Schema.Types.ObjectId, ref: "user" }],
  type: {
    type: String,
    enum: ["like", "comment", "reply", "subscription"],
    required: true,
  },
  videoId: { type: Schema.Types.ObjectId, ref: "Video", default: null },
  commentUser: { type: Schema.Types.ObjectId, ref: "user", default: null },
  text: { type: String },
  metadata: { type: Schema.Types.Mixed },
  read: { type: Boolean, default: false },
}, { timestamps: true });

NotificationSchema.plugin(mongoosePaginate);

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId; 
  post: mongoose.Types.ObjectId;
  actorIds: mongoose.Types.ObjectId[]; 
  type: "like" | "comment" | "reply" | "subscription"; 
  videoId?: mongoose.Types.ObjectId; 
  commentUser?: mongoose.Types.ObjectId;
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