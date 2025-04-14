import express from "express";
import { protect } from "../middleware/protect";
import validateAddPlaylistRequest, { validateAddPlaylistSchema } from "../middleware/validation/playlist/playlistValidationSchema";
import { createPlaylist, getPlaylist, getPlaylists, updatePlaylist, updatePlaylistCoverPhoto, uploadVideoToPlaylist } from "../controllers/Playlists/PlaylistController";
import upload from "../middleware/multer";

const router = express.Router();

router.get("/", protect, getPlaylists);
router.get("/:playlistId", getPlaylist);
router.patch("/:playlistId/video", [protect, upload.single("playlistVideo")], uploadVideoToPlaylist);
router.patch("/:playlistId", [protect, upload.single("playlistCoverPhoto")], updatePlaylist);
router.patch("/playlistCoverPhoto/:playlistId", [protect, upload.single("playlistCover")], updatePlaylistCoverPhoto);
router.post("/", [upload.single("playlistCoverPhoto"), validateAddPlaylistRequest(validateAddPlaylistSchema), protect], createPlaylist);

export default router;