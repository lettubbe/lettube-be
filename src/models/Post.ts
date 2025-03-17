import { Model, model, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const postSchema = new Schema<IPost>(
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

export interface IPost extends Document {
  user: Types.ObjectId;
  categories: string[];
  thumbnail: string;
  videoUrl: string;
  reactions: {
    likes: Types.ObjectId[];
    dislikes: Types.ObjectId[];
    shares: number;
    views: number;
  };
  comments: {
    user: Types.ObjectId;
    text: string;
    likes: Types.ObjectId[];
    replies: {
      user: Types.ObjectId;
      text: string;
      likes: Types.ObjectId[];
      createdAt: Date;
    }[];
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostModel extends Model<IPost> {
  paginate(
    query: object,
    options: object
  ): Promise<{
    docs: IPost[];
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

const Post = model<IPost, IPostModel>("post", postSchema);

export default Post;
