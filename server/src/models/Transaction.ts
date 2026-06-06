import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  job: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  dev: mongoose.Types.ObjectId;
  amount: number;
  stripePaymentIntentId: string;
  status: 'pending' | 'held' | 'released' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dev: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    stripePaymentIntentId: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'held', 'released', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
