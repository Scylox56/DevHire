import { Response } from 'express';
import Job from '../models/Job';
import Proposal from '../models/Proposal';
import Transaction from '../models/Transaction';
import User from '../models/User';
import Report from '../models/Report';
import { AuthRequest } from '../middleware/auth';

export const getClientAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const totalJobs = await Job.countDocuments({ client: userId });
    const activeJobs = await Job.countDocuments({ client: userId, status: 'in_progress' });
    const completedJobs = await Job.countDocuments({ client: userId, status: 'completed' });

    const totalSpent = await Transaction.aggregate([
      { $match: { client: userId, status: 'released' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const recentJobs = await Job.find({ client: userId })
      .populate('awardedTo', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalJobs,
      activeJobs,
      completedJobs,
      totalSpent: totalSpent[0]?.total || 0,
      recentJobs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getDevAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const totalProposals = await Proposal.countDocuments({ dev: userId });
    const acceptedProposals = await Proposal.countDocuments({ dev: userId, status: 'accepted' });

    const totalEarned = await Transaction.aggregate([
      { $match: { dev: userId, status: 'released' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const activeJobs = await Job.countDocuments({ awardedTo: userId, status: 'in_progress' });
    const completedJobs = await Job.countDocuments({ awardedTo: userId, status: 'completed' });

    const recentJobs = await Job.find({ awardedTo: userId })
      .populate('client', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalProposals,
      acceptedProposals,
      totalEarned: totalEarned[0]?.total || 0,
      activeJobs,
      completedJobs,
      recentJobs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAdminAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await Promise.all([
      User.countDocuments({ role: 'client' }),
      User.countDocuments({ role: 'dev' }),
      User.countDocuments({ role: 'moderator' }),
      User.countDocuments({ role: 'super_admin' }),
    ]);

    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'in_progress' });
    const completedJobs = await Job.countDocuments({ status: 'completed' });
    const openJobs = await Job.countDocuments({ status: 'open' });
    const cancelledJobs = await Job.countDocuments({ status: 'cancelled' });

    const [transactionRevenue, jobRevenue] = await Promise.all([
      Transaction.aggregate([
        { $match: { status: 'released' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Job.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$budget' } } },
      ]),
    ]);
    const totalRevenue = Math.max(
      transactionRevenue[0]?.total || 0,
      jobRevenue[0]?.total || 0
    );

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [newSignups, newJobs, pendingReports] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Job.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Report.countDocuments({ status: 'pending' }),
    ]);

    res.json({
      totalClients: totalUsers[0],
      totalDevs: totalUsers[1],
      totalModerators: totalUsers[2],
      totalAdmins: totalUsers[3],
      totalJobs,
      activeJobs,
      completedJobs,
      openJobs,
      cancelledJobs,
      totalRevenue,
      newSignups,
      newJobs,
      pendingReports,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
