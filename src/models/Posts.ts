import { model, Schema } from "mongoose";

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: [true],
  },
  categories: [String],
  thumbnail: {
    type: String,
    required: [true, "Thumbnail is required"]
  },
  videoUrl: {
    type: String,
    required: [true, "Thumbnail is required"]
  },
  reactions: {
    
  }
});

const Post = model("post", postSchema);

export default Post;
