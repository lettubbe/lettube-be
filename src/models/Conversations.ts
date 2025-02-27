import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    text: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    },
    videoUrl: {
        type: String,
        default: ""
    },
    seen: {
        type: Boolean,
        default: false
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "Sender is required"],
      ref: "user"
    }
}, { timestamps: true });

const conversationSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    required: [true, "Sender is required"],
    ref: "user"
  },
  receiver: {
    type: Schema.Types.ObjectId,
    required: [true, "Sender is required"],
    ref: "user"
  },
  messages: [
    { type: Schema.Types.ObjectId, ref: "message" }
  ],
}, { timestamps: true });


export const Message = model("message", messageSchema);
export const Conversation = model("conversation", conversationSchema);