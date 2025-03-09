"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const AuthRoute_1 = __importDefault(require("./AuthRoute"));
const ProfileRoute_1 = __importDefault(require("./ProfileRoute"));
const CategoryRoute_1 = __importDefault(require("./CategoryRoute"));
const SubscriptionRoute_1 = __importDefault(require("./SubscriptionRoute"));
const FeedRoute_1 = __importDefault(require("./FeedRoute"));
router.use("/auth", AuthRoute_1.default);
router.use("/profile", ProfileRoute_1.default);
router.use("/category", CategoryRoute_1.default);
router.use("/subscription", SubscriptionRoute_1.default);
router.use("/feeds", FeedRoute_1.default);
exports.default = router;
