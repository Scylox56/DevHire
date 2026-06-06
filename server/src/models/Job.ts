import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  client: mongoose.Types.ObjectId;
  title: string;
  description: string;
  techStack: string[];
  budget: number;
  timeline: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  awardedTo?: mongoose.Types.ObjectId;
  submissionNote?: string;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    techStack: [{ type: String, trim: true }],
    budget: { type: Number, required: true, min: 0 },
    timeline: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'cancelled'],
      default: 'open',
    },
    awardedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    submissionNote: { type: String },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ techStack: 1 });

export default mongoose.model<IJob>('Job', jobSchema);
