import { Document, Model, model, Schema } from "mongoose";

const BlockedChannelSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  blockedUser: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
}, { timestamps: true });

export interface IBlockedChannel extends Document {
  user: string;
  blockedUser: string;
}

const BlockedChannel = model<IBlockedChannel>("blockedChannel", BlockedChannelSchema);

export default BlockedChannel;