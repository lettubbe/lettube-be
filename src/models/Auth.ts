import { model, Schema } from "mongoose";

const authSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: [true]
    },
    type: {
        type: String,
        required: [true, "Register Type is required"]
    },
}, { timestamps: true });

const Auth = model("auth", authSchema);

export default Auth;