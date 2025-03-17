import asyncHandler from "express-async-handler";
import { uploadFile } from "../../lib/utils/fileUpload";
import ErrorResponse from "../../messages/ErrorResponse";
import { getAuthUser } from "../../lib/utils/utils";
import Playlist from "../../models/Playlist";
import baseResponseHandler from "../../messages/BaseResponseHandler";
import { getPaginateOptions, transformPaginateResponse } from "../../lib/utils/paginate";


// @route   POST /api/v1/playlist
// @desc    Create A Playlist
// @access  Private

export const createPlaylist = asyncHandler(async (req, res, next) => {

    const user = await getAuthUser(req, next);

    const { name, description } = req.body;

    const playlistCoverPhoto = await uploadFile(req, next, `playlistCoversPhotos/${user._id}`);

    if(!playlistCoverPhoto){
        return next(new ErrorResponse(`Failed to upload Cover Photo`, 400));
    }

    const playlist = await Playlist.create({
        name,
        user: user._id,
        description: description ? description : null,
        coverPhoto: playlistCoverPhoto
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

    const options = getPaginateOptions(page, limit);

    const playlists = await Playlist.paginate({ user: user._id }, options);

    const playlistData = transformPaginateResponse(playlists);

    baseResponseHandler({
        message: `Playlist Retrived Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: playlistData
    });

});

// @route   PATCH /api/v1/playlist/:playlistId
// @desc    get playlist
// @access  Private

export const getPlaylist = asyncHandler(async (req, res, next) => {

    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        return next(new ErrorResponse(`Playlist not found`, 404));
    }

    baseResponseHandler({
        message: `Playlist retrieved Successfully`,
        res,
        statusCode:200,
        success: true,
        data: playlist
    });

});

// @route   PATCH /api/v1/playlist/video
// @desc    Upload Video To Playlist
// @access  Private

export const uploadVideoToPlaylist = asyncHandler(async (req, res, next) => {

    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        return next(new ErrorResponse(`Playlist Not Found`, 404));
    }

    playlist.videos.unshift();

    playlist.save();

    baseResponseHandler({
        message: `Playlist Uploaded to successfully`,
        res,
        statusCode: 200,
        success: true,
        data: playlist,
    });
});

// @route   PATCH /api/v1/playlist
// @desc    Upload Video To Playlist
// @access  Private

export const updatePlaylist = asyncHandler(async (req, res, next) => {

    const { name, description, visibility } = req.body;
    const { playlistId } = req.params;

    const playlistData = {
        name,
        description,
        visibility
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId, playlistData, {
        new: true
    });


    baseResponseHandler({
        message: `Playlist Updated Successfullly`,
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

    if(!playlist){
        return next(new ErrorResponse(`No Playlist found`, 404));
    }

    const playlistCoverPhoto = await uploadFile(req, next, `playlistCoversPhotos/${user._id}`);

    if(!playlistCoverPhoto){
        return next(new ErrorResponse(`Error Occured When uploading photo`, 404));
    }

    playlist.coverPhoto = playlistCoverPhoto;


    baseResponseHandler({
        message: `Playlist Updated Successfullly`,
        res,
        statusCode: 200,
        success: true,
        data: playlist,
    });

});