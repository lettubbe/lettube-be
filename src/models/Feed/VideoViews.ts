import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const VideoViewsSchema = new mongoose.Schema(
  {
    views: {
      type: [String],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
  },
  { timestamps: true }
);

export interface IVideoViews {
    views: string[];
    post: string;
}

export interface IVideoViewsModel extends Model<IVideoViews> {
  paginate(
    query: object,
    options: object
  ): Promise<{
    docs: IVideoViews[];
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

VideoViewsSchema.plugin(mongoosePaginate);

const VideoView = mongoose.model<IVideoViews, IVideoViewsModel>("videoViews", VideoViewsSchema);

export default VideoView;