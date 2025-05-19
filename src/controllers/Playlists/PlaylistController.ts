import asyncHandler from "express-async-handler";
import { uploadFile } from "../../lib/utils/fileUpload";
import ErrorResponse from "../../messages/ErrorResponse";
import { getAuthUser } from "../../lib/utils/utils";
import Playlist from "../../models/Feed/Playlist";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import {
  getPaginateOptions,
  transformPaginateResponse,
} from "../../lib/utils/paginate";

// @route   POST /api/v1/playlist
// @desc    Create A Playlist
// @access  Private

export const createPlaylist = asyncHandler(async (req, res, next) => {
  console.log("hitting creating playlist");

  const user = await getAuthUser(req, next);

  const { name, description, visibility } = req.body;

  const playlistCoverPhoto = await uploadFile(
    req,
    next,
    `playlistCoversPhotos/${user._id}`
  );

  if (!playlistCoverPhoto) {
    return next(new ErrorResponse(`Failed to upload Cover Photo`, 400));
  }

  const playlist = await Playlist.create({
    name,
    user: user._id,
    visibility,
    description: description ? description : null,
    coverPhoto: playlistCoverPhoto,
  });

  baseResponseHandler({
    message: `Playlist Created Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: playlist,
  });
});

// @route   GET /api/v1/playlist
// @desc    get users Playlists
// @access  Private

export const getPlaylists = asyncHandler(async (req, res, next) => {
  const user = await getAuthUser(req, next);

  const { limit = 10, page = 1 } = req.params;
  const { search = "" } = req.query;

  const options = getPaginateOptions(page, limit);

  const query = {
    user: user._id,
    ...(search && {
      name: { $regex: search, $options: "i" },
    }),
  };

  const playlists = await Playlist.paginate(query, options);

  const playlistData = transformPaginateResponse(playlists);

  baseResponseHandler({
    message: `Playlists Retrieved Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: playlistData,
  });
});

// @route   PATCH /api/v1/playlist/:playlistId
// @desc    get playlist
// @access  Private

export const getPlaylist = asyncHandler(async (req, res, next) => {
  const { playlistId } = req.params;

  // const playlist = await Playlist.findById(playlistId).populate("user");

  const playlist = await Playlist.findById(playlistId).populate(
    "user",
    "-password"
  );

  if (!playlist) {
    return next(new ErrorResponse(`Playlist not found`, 404));
  }

  baseResponseHandler({
    message: `Playlist retrieved Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: playlist,
  });
});

// @route   PATCH /api/v1/playlist/video
// @desc    Upload Video To Playlist
// @access  Private

export const uploadVideoToPlaylist = asyncHandler(async (req, res, next) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    return next(new ErrorResponse(`Playlist not found`, 404));
  }

  const user = await getAuthUser(req, next);

  const uploadedVideo = await uploadFile(
    req,
    next,
    `${playlist.name}/${user._id}/playlist/videos`
  );

  // Ensure the upload was successful
  if (!uploadedVideo) {
    return next(new ErrorResponse("Failed to upload video", 500));
  }

  // Add the video URL to the beginning of the playlist's videos array
  // playlist.videos.unshift({});
  // playlist.videos.unshift(uploadedVideo);

  await playlist.save();

  baseResponseHandler({
    message: `Video uploaded to playlist successfully`,
    res,
    statusCode: 200,
    success: true,
    data: playlist,
  });
});

// @route   PATCH /api/v1/playlist/:playlistId
// @desc    Upload Video To Playlist
// @access  Private

export const updatePlaylist = asyncHandler(async (req, res, next) => {
  const { name, description, visibility } = req.body;
  const { playlistId } = req.params;

  const playlistData = {
    name,
    description,
    visibility,
  };

  const user = await getAuthUser(req, next);

  const playlistCoverPhoto = await uploadFile(
    req,
    next,
    `playlistCoversPhotos/${user._id}`,
    true
  );

  const playlist = await Playlist.findByIdAndUpdate(playlistId, playlistData, {
    new: true,
  });

  if (!playlist) {
    return next(new ErrorResponse(`No Playlist found`, 404));
  }

  if (playlistCoverPhoto) {
    playlist.coverPhoto = playlistCoverPhoto;
    await playlist.save();
  }

  await playlist.save();

  baseResponseHandler({
    message: `Playlist Updated Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: playlist,
  });
});

// @route   PATCH /api/v1/playlist/playlistCoverPhoto
// @desc    Upload Video To Playlist
// @access  Private

export const updatePlaylistCoverPhoto = asyncHandler(async (req, res, next) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);

  const user = await getAuthUser(req, next);

  if (!playlist) {
    return next(new ErrorResponse(`No Playlist found`, 404));
  }

  const playlistCoverPhoto = await uploadFile(
    req,
    next,
    `playlistCoversPhotos/${user._id}`
  );

  if (!playlistCoverPhoto) {
    return next(new ErrorResponse(`Error Occurred When uploading photo`, 404));
  }

  playlist.coverPhoto = playlistCoverPhoto;

  baseResponseHandler({
    message: `Playlist Updated Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: playlist,
  });
});

// @route   GET /api/v1/playlist/video
// @desc    Get Playlist Videos
// @access  Private

export const getPlaylistVideos = asyncHandler(async (req, res, next) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId).populate('videos');

  if (!playlist) {
    return next(new ErrorResponse(`No Playlist found`, 404));
  }

  baseResponseHandler({
    message: `Playlist Videos Retrieved Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: playlist.videos,
  });
});

// @route   DELETE /api/v1/playlist/:playlistId
// @desc    Delete a playlist
// @access  Private
export const deletePlaylist = asyncHandler(async (req, res, next) => {
  const { playlistId } = req.params;
  const user = await getAuthUser(req, next);

  const playlist = await Playlist.findOne({ _id: playlistId, user: user._id });

  if (!playlist) {
    return next(new ErrorResponse('Playlist not found or unauthorized', 404));
  }

  await Playlist.deleteOne({ _id: playlistId });

  baseResponseHandler({
    message: 'Playlist deleted successfully',
    res,
    statusCode: 200,
    success: true,
    data: null
  });
});
