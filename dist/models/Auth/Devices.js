"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DeviceSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "user" },
    deviceToken: { type: String, required: true },
}, { timestamps: true });
const Device = (0, mongoose_1.model)("device", DeviceSchema);
exports.default = Device;
