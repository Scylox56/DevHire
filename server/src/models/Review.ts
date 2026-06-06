import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  job: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  reviewee: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  role: 'client' | 'dev';
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    role: { type: String, enum: ['client', 'dev'], required: true },
  },
  { timestamps: true }
);

reviewSchema.index({ job: 1, reviewer: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', reviewSchema);
