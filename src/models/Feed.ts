import { Document, Model, model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const FeedSchema = new Schema({
  categories: [String],
});

export interface IFeed extends Document {
  categories: string[];
}

export interface IFeedModel extends Model<IFeed> {
  paginate(
    query: object,
    options: object
  ): Promise<{
    docs: IFeed[];
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

const Feed = model<IFeed, IFeedModel>("feed", FeedSchema);

export default Feed;
