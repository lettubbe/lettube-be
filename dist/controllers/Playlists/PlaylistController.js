"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideoToPlaylist = exports.getPlaylist = exports.createPlaylist = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const fileUpload_1 = require("../../lib/utils/fileUpload");
const ErrorResponse_1 = __importDefault(require("../../messages/ErrorResponse"));
const utils_1 = require("../../lib/utils/utils");
const Playlist_1 = __importDefault(require("../../models/Playlist"));
const BaseResponseHandler_1 = __importDefault(require("../../messages/BaseResponseHandler"));
const paginate_1 = require("../../lib/utils/paginate");
// @route   POST /api/v1/playlist
// @desc    Create A Playlist
// @access  Private
exports.createPlaylist = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const { name } = req.body;
    const playlistCoverPhoto = yield (0, fileUpload_1.uploadFile)(req, next, `playlistCoversPhotos/${user._id}`);
    if (!playlistCoverPhoto) {
        return next(new ErrorResponse_1.default(`Failed to upload Cover Photo`, 400));
    }
    const playlist = yield Playlist_1.default.create({
        name,
        coverPhoto: playlistCoverPhoto
    });
    (0, BaseResponseHandler_1.default)({
        message: `Playlist Created Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: playlist,
    });
}));
// @route   GET /api/v1/playlist
// @desc    get users Playlists
// @access  Private
exports.getPlaylist = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, page = 1 } = req.params;
    const options = (0, paginate_1.getPaginateOptions)(page, limit);
    const playlists = yield Playlist_1.default.paginate({}, options);
    const playlistData = (0, paginate_1.transformPaginateResponse)(playlists);
    (0, BaseResponseHandler_1.default)({
        message: `Playlist Retrived Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: playlistData
    });
}));
// @route   PATCH /api/v1/playlist
// @desc    Upload Video To Playlist
// @access  Private
exports.uploadVideoToPlaylist = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { playlistId } = req.params;
    const playlist = yield Playlist_1.default.findById(playlistId);
    if (!playlist) {
        return next(new ErrorResponse_1.default(`Playlist Not Found`, 404));
    }
    playlist.videos.unshift();
    playlist.save();
    (0, BaseResponseHandler_1.default)({
        message: `Playlist Uploaded to successfully`,
        res,
        statusCode: 200,
        success: true,
        data: playlist,
    });
}));
