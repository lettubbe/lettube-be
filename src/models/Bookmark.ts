import { Document, Model, model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const BookmarkSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "post",
    required: true,
  }
}, { timestamps: true });

// Create compound index for user and post to ensure uniqueness
BookmarkSchema.index({ user: 1, post: 1 }, { unique: true });

export interface IBookmark extends Document {
  user: string;
  post: string;
}

export interface IBookmarkModel extends Model<IBookmark> {
  paginate(
    query: object,
    options: object
  ): Promise<{
    docs: IBookmark[];
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

BookmarkSchema.plugin(mongoosePaginate);

const Bookmark = model<IBookmark, IBookmarkModel>("bookmark", BookmarkSchema);

export default Bookmark;