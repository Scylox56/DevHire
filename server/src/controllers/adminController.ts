import { Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import Job from '../models/Job';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { search, role, status, page = '1', limit = '20' } = req.query;
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
      ];
    }
    if (role && role !== 'all') filter.role = role;
    if (status === 'suspended') filter.isActive = false;
    else if (status === 'active') filter.isActive = true;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await User.countDocuments(filter);

    res.json({ users, page: pageNum, pages: Math.ceil(total / limitNum), total });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const jobsPosted = await Job.countDocuments({ client: user._id });
    const jobsCompleted = await Job.countDocuments({ awardedTo: user._id, status: 'completed' });
    const totalEarned = await Transaction.aggregate([
      { $match: { dev: user._id, status: 'released' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalSpent = await Transaction.aggregate([
      { $match: { client: user._id, status: 'released' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      ...user.toObject(),
      stats: {
        jobsPosted,
        jobsCompleted,
        totalEarned: totalEarned[0]?.total || 0,
        totalSpent: totalSpent[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { role, isVerified, isActive } = req.body;
    const updates: Record<string, unknown> = {};

    if (role) updates.role = role;
    if (typeof isVerified === 'boolean') updates.isVerified = isVerified;
    if (typeof isActive === 'boolean') {
      updates.isActive = isActive;
      updates.suspendedAt = isActive ? null : new Date();
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const suspendUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.isActive = !user.isActive;
    user.suspendedAt = user.isActive ? undefined : new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      suspendedAt: user.suspendedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const tempPassword = crypto.randomBytes(4).toString('hex');
    user.password = tempPassword;
    await user.save();

    res.json({ message: 'Password reset successfully', tempPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const verifyDev = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({ _id: user._id, name: user.name, isVerified: user.isVerified });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const verifyEmail = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.emailVerified = true;
    await user.save();

    res.json({ _id: user._id, name: user.name, emailVerified: user.emailVerified });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
