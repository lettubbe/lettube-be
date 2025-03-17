import express from "express";
import { protect } from "../middleware/protect";
import validateAddPlaylistRequest, { validateAddPlaylistSchema } from "../middleware/validation/playlist/playlistValidationSchema";
import { createPlaylist, getPlaylist, getPlaylists, updatePlaylist, updatePlaylistCoverPhoto, uploadVideoToPlaylist } from "../controllers/Playlists/PlaylistController";
import upload from "../middleware/multer";

const router = express.Router();

router.get("/", protect, getPlaylists);
router.post("/", [upload.single("playlistCoverPhoto"), validateAddPlaylistRequest(validateAddPlaylistSchema), protect], createPlaylist);
router.get("/:playlistId", getPlaylist);
router.patch("/:playlistId", protect, updatePlaylist);
router.patch("/video", protect, uploadVideoToPlaylist);
router.patch("/playlistCoverPhoto/:playlistId", [protect, upload.single("playlistCover")], updatePlaylistCoverPhoto);

export default router;