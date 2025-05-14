import { Document, Model, model, Schema } from "mongoose";

const NotInterestedSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "post",
    required: true
  }
}, { timestamps: true });

export interface INotInterested extends Document {
  user: string;
  post: string;
}

const NotInterested = model<INotInterested>("notInterested", NotInterestedSchema);

export default NotInterested;