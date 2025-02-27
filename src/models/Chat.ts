import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model("chat", ChatSchema);

export default Chat;
