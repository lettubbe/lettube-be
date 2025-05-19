import { Schema, model } from "mongoose";

const DeviceSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    deviceToken: { type: String, required: true },
}, { timestamps: true });

const Device = model("device", DeviceSchema);

export default Device;