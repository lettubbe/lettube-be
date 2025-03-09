import { Document, Model, model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const FeedSchema = new Schema({
    categories: [String],
});

export interface IFeed extends Document {
    categories: [string]
}

export interface IFeedModel extends Model<IFeed> {
    
}



const Feed = model<IFeed, IFeedModel>("feed", FeedSchema);

export default Feed;