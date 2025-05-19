import { model, Schema, Document, Model, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const playlistSchema = new Schema({
  name: {
    type: String,
    required: [true, "Playlist name is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: [true],
  },
  coverPhoto: {
    type: String,
    required: [true, "Cover is required"],
  },
  description: {
    type: String,
  },
  videos: [{
    type: Schema.Types.ObjectId,
    ref: "post",  
  }],
  visibility: {
    type: String,
    enum: ["private", "public"],
  },
}, {  timestamps: true});

export interface IPlaylist extends Document {
  name: string;
  coverPhoto: string;
  description: string | null;
  videos: Types.ObjectId[];
}

export interface IPlaylistModel extends Model<IPlaylist> {
  paginate(
    query: object,
    options: object
  ): Promise<{
    docs: IPlaylist[];
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

playlistSchema.plugin(mongoosePaginate);

const Playlist = model<IPlaylist, IPlaylistModel>("playlist", playlistSchema);

export default Playlist;
