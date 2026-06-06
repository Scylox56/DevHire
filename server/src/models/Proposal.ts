import mongoose, { Schema, Document } from 'mongoose';

export interface IProposal extends Document {
  job: mongoose.Types.ObjectId;
  dev: mongoose.Types.ObjectId;
  coverLetter: string;
  bidAmount: number;
  estimatedTimeline: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const proposalSchema = new Schema<IProposal>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    dev: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coverLetter: { type: String, required: true },
    bidAmount: { type: Number, required: true, min: 0 },
    estimatedTimeline: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

proposalSchema.index({ job: 1, dev: 1 }, { unique: true });

export default mongoose.model<IProposal>('Proposal', proposalSchema);
