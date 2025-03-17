import { model, Schema, Types } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    categories: [String],
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    reactions: {
      likes: [{ type: Schema.Types.ObjectId, ref: "user" }], 
      dislikes: [{ type: Schema.Types.ObjectId, ref: "user" }], 
      shares: { type: Number, default: 0 }, 
      views: { type: Number, default: 0 },
    },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        text: { type: String, required: true },
        likes: [{ type: Schema.Types.ObjectId, ref: "user" }], // Users who liked the comment
        replies: [
          {
            user: { type: Schema.Types.ObjectId, ref: "user", required: true },
            text: { type: String, required: true },
            likes: [{ type: Schema.Types.ObjectId, ref: "user" }],
            createdAt: { type: Date, default: Date.now },
          },
        ],
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Post = model("post", postSchema);

export default Post;
