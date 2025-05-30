import { Document, Schema, model, Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const SubscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    subscribedTo: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export interface ISubscription extends Document {
  subscriber: string;
  subscribedTo: string;
}

export interface ISubscriptionModel extends Model<ISubscription> {
    paginate(
      query: object,
      options: object
    ): Promise<{
      docs: ISubscription[];
      totalDocs: number;
      limit: number;
      totalPages: number;
      page: number;
      pagingCounter: number;
      hasPrevPage: boolean;
      hasNextPage: boolean;
      prevPage: number | null;
      nextPage: number | null;
    }>;
}

SubscriptionSchema.plugin(mongoosePaginate);

// Ensure a user cannot subscribe to the same person multiple times
SubscriptionSchema.index({ subscriber: 1, subscribedTo: 1 }, { unique: true });

const Subscription = model<ISubscription, ISubscriptionModel>("Subscription", SubscriptionSchema);

export default Subscription;