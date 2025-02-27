"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const authSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: [true]
    },
    type: {
        type: String,
        required: [true, "Register Type is required"]
    },
}, { timestamps: true });
const Auth = (0, mongoose_1.model)("auth", authSchema);
exports.default = Auth;
