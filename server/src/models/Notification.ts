import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: 'proposal_received' | 'proposal_accepted' | 'new_message' | 'job_awarded' | 'payment_released' | 'review_received' | 'work_submitted' | 'job_completed';
  title: string;
  message: string;
  data: {
    jobId?: string;
    proposalId?: string;
    conversationId?: string;
    transactionId?: string;
    reviewId?: string;
    actorId?: string;
    actorName?: string;
    actorAvatar?: string;
  };
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['proposal_received', 'proposal_accepted', 'new_message', 'job_awarded', 'payment_released', 'review_received', 'work_submitted', 'job_completed'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: {
      jobId: { type: String },
      proposalId: { type: String },
      conversationId: { type: String },
      transactionId: { type: String },
      reviewId: { type: String },
      actorId: { type: String },
      actorName: { type: String },
      actorAvatar: { type: String },
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
