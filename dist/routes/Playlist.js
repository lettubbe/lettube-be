"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protect_1 = require("../middleware/protect");
const playlistValidationSchema_1 = __importStar(require("../middleware/validation/playlist/playlistValidationSchema"));
const PlaylistController_1 = require("../controllers/Playlists/PlaylistController");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = express_1.default.Router();
router.get("/", protect_1.protect, PlaylistController_1.getPlaylists);
router.get("/:playlistId", PlaylistController_1.getPlaylist);
router.patch("/:playlistId/video", [protect_1.protect, multer_1.default.single("playlistVideo")], PlaylistController_1.uploadVideoToPlaylist);
router.patch("/:playlistId", [protect_1.protect, multer_1.default.single("playlistCoverPhoto")], PlaylistController_1.updatePlaylist);
router.patch("/playlistCoverPhoto/:playlistId", [protect_1.protect, multer_1.default.single("playlistCover")], PlaylistController_1.updatePlaylistCoverPhoto);
router.post("/", [multer_1.default.single("playlistCoverPhoto"), (0, playlistValidationSchema_1.default)(playlistValidationSchema_1.validateAddPlaylistSchema), protect_1.protect], PlaylistController_1.createPlaylist);
exports.default = router;
