import { Document, Model, model, Schema } from "mongoose";

export enum ReportCategory {
  SPAM = 'spam',
  VIOLENCE = 'violence',
  HARASSMENT = 'harassment',
  HATE_SPEECH = 'hate_speech',
  SEXUAL_CONTENT = 'sexual_content',
  COPYRIGHT = 'copyright',
  OTHER = 'other'
}

const ReportSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
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

export interface IReport extends Document {
  user: string;
  post: string;
  category: ReportCategory;
  reason: string;
  status: string;
}

const Report = model<IReport>("report", ReportSchema);

export default Report;