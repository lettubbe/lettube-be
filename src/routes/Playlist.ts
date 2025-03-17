import express from "express";
import { protect } from "../middleware/protect";
import validateAddPlaylistRequest, { validateAddPlaylistSchema } from "../middleware/validation/playlist/playlistValidationSchema";
import { createPlaylist, getPlaylist } from "../controllers/Playlists/PlaylistController";
import upload from "../middleware/multer";

const router = express.Router();

router.get("/", protect, getPlaylist);
router.post("/", [validateAddPlaylistRequest(validateAddPlaylistSchema), upload.single("playlistCoverPhoto"), protect], createPlaylist);

export default router;