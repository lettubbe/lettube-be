import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscribedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a user cannot subscribe to the same person multiple times
SubscriptionSchema.index({ subscriber: 1, subscribedTo: 1 }, { unique: true });

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
export default Subscription;