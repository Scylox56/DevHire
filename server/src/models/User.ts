import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'dev' | 'moderator' | 'super_admin';
  avatar?: string;
  title?: string;
  bio?: string;
  skills: string[];
  hourlyRate?: number;
  portfolio: { title: string; url: string; description?: string }[];
  completedJobs: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isVerified: boolean;
  emailVerified: boolean;
  suspendedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['client', 'dev', 'moderator', 'super_admin'], default: 'dev' },
    avatar: { type: String },
    title: { type: String, trim: true },
    bio: { type: String },
    skills: [{ type: String, trim: true }],
    hourlyRate: { type: Number, min: 0 },
    portfolio: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        description: { type: String },
      },
    ],
    completedJobs: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    suspendedAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
