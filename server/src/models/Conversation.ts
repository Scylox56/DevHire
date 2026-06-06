import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  job: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  dev: mongoose.Types.ObjectId;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dev: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

conversationSchema.index({ job: 1, client: 1, dev: 1 }, { unique: true });

export default mongoose.model<IConversation>('Conversation', conversationSchema);
