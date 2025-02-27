import mongoose, { Schema, Document } from "mongoose";

interface IDeleteUser extends Document {
  userId: mongoose.Types.ObjectId;
  reason: string;
}

const DeleteUserSchema = new Schema<IDeleteUser>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
  },
}, { timestamps: true });

const DeleteUser = mongoose.model<IDeleteUser>("DeleteUser", DeleteUserSchema);

export default DeleteUser;
