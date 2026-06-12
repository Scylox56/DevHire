import { Response } from 'express';
import Job from '../models/Job';
import Report from '../models/Report';
import Message from '../models/Message';
import Review from '../models/Review';
import Proposal from '../models/Proposal';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getAllJobs = async (req: AuthRequest, res: Response) => {
  try {
    const {
      status,
      flagged,
      search,
      page = '1',
      limit = '20',
      sort = '-createdAt',
    } = req.query;
    const filter: Record<string, unknown> = {};

    if (status && status !== 'all') filter.status = status;
    if (flagged === 'true') filter.isFlagged = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const jobs = await Job.find(filter)
      .populate('client', 'name email avatar')
      .populate('awardedTo', 'name email avatar')
      .sort(sort as string)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Job.countDocuments(filter);

    res.json({ jobs, page: pageNum, pages: Math.ceil(total / limitNum), total });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAdminJobById = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('client', 'name email avatar')
      .populate('awardedTo', 'name email avatar');

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    const proposals = await Proposal.find({ job: job._id })
      .populate('dev', 'name email avatar title hourlyRate')
      .sort({ createdAt: -1 });

    res.json({ ...job.toObject(), proposals });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateJobStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const filter: Record<string, unknown> = {};

    if (status && status !== 'all') filter.status = status;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const reports = await Report.find(filter)
      .populate('reportedBy', 'name email avatar')
      .populate('resolvedBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Report.countDocuments(filter);

    const populated = await Promise.all(
      reports.map(async (report) => {
        let target: Record<string, unknown> | null = null;
        if (report.targetType === 'job') {
          target = await Job.findById(report.targetId)
            .populate('client', 'name email')
            .lean();
        } else if (report.targetType === 'message') {
          target = await Message.findById(report.targetId).lean();
        } else if (report.targetType === 'user') {
          target = await User.findById(report.targetId)
            .select('name email avatar')
            .lean();
        }
        return { ...report.toObject(), target };
      })
    );

    res.json({ reports: populated, page: pageNum, pages: Math.ceil(total / limitNum), total });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    const { targetType, targetId, reason } = req.body;

    const existing = await Report.findOne({
      targetType,
      targetId,
      reportedBy: req.user!._id,
      status: 'pending',
    });

    if (existing) {
      res.status(400).json({ message: 'Already reported this content' });
      return;
    }

    const report = await Report.create({
      targetType,
      targetId,
      reportedBy: req.user!._id,
      reason,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const resolveReport = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status,
        resolvedBy: req.user!._id,
        resolvedAt: new Date(),
      },
      { new: true }
    );

    if (!report) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const removeContent = async (req: AuthRequest, res: Response) => {
  try {
    const { type, id } = req.params;

    switch (type) {
      case 'job':
        await Job.findByIdAndDelete(id);
        await Proposal.deleteMany({ job: id });
        break;
      case 'message':
        await Message.findByIdAndDelete(id);
        break;
      case 'review':
        await Review.findByIdAndDelete(id);
        break;
      default:
        res.status(400).json({ message: 'Invalid content type' });
        return;
    }

    res.json({ message: `${type} removed successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
