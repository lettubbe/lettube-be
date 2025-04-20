"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYSTACK_BASE_URL = exports.FLUTTER_WAVE_BASE_URL = exports.ITEM_STATUS = void 0;
// import { CANCELLED } from "dns";
exports.ITEM_STATUS = {
    OPEN: "open",
    CREATED: "created",
    PENDING: "pending",
    SUCCESSFUL: "successful",
    REVIEWING: "reviewing",
    CANCELLED: "cancelled",
    ACTIVE: "active",
    DEACTIVATED: "deactivated",
    COMPLETED: "completed",
    SELF_DEACTIVATED: "self_deactivated",
    DELETED: "deleted",
    ARCHIVED: "archived",
    SUSPENDED: "suspended",
    HIDDEN: "hidden",
    CLOSED: "closed",
    APPROVED: "approved",
    REJECTED: "rejected",
    FAILED: "failed",
    BLOCKED: "blocked",
    APPLIED: "applied",
    SELF_DELETED: "self_deleted",
    ACCEPTED: "accepted",
    NOT_STARTED: "not_started",
    STARTED: "started",
    ONGOING: "ongoing"
};
exports.FLUTTER_WAVE_BASE_URL = "https://api.flutterwave.com/v3/";
exports.PAYSTACK_BASE_URL = "https://api.paystack.co";
