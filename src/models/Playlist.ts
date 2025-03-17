import { model, Schema, Document, Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: [true, "Playlist name is required"]
    },
    coverPhoto: {
        type: String,
        required: [true, "Cover is required"]
    },
    videos: {
        type: [String]
    },
    visibility: {
        type: String,
        enum: ["private", "public"],
    }
});

export interface IPlaylist extends Document {
    name: string;
    coverPhoto: string;
    videos: string[]
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
