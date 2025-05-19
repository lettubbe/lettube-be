"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCategory = void 0;
const mongoose_1 = require("mongoose");
var ReportCategory;
(function (ReportCategory) {
    ReportCategory["SPAM"] = "spam";
    ReportCategory["VIOLENCE"] = "violence";
    ReportCategory["HARASSMENT"] = "harassment";
    ReportCategory["HATE_SPEECH"] = "hate_speech";
    ReportCategory["SEXUAL_CONTENT"] = "sexual_content";
    ReportCategory["COPYRIGHT"] = "copyright";
    ReportCategory["OTHER"] = "other";
})(ReportCategory || (exports.ReportCategory = ReportCategory = {}));
const ReportSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "post",
        required: true
    },
    category: {
        type: String,
        enum: Object.values(ReportCategory),
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    }
}, { timestamps: true });
const Report = (0, mongoose_1.model)("report", ReportSchema);
exports.default = Report;
