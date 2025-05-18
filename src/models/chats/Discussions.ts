import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const GroupMessageSchema = new Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "Sender is required"],
      ref: "User",
    },
    repliedTo: {
      type: Schema.Types.ObjectId,
      ref: "groupMessages",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);


const DiscussionSchema = new Schema(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: "group",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    reactions: {
      likes: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
      likedBy: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ], 
    },
    comments: [
      { type: Schema.Types.ObjectId, ref: "groupMessages" }
    ],
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

// Add pagination
DiscussionSchema.plugin(mongoosePaginate);

export const GroupMessage = model("groupMessages", GroupMessageSchema);
const Discussion = model<any, any>("discussion", DiscussionSchema);

export default Discussion;
