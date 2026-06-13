import { Response } from 'express';
import Job from '../models/Job';
import Proposal from '../models/Proposal';
import Review from '../models/Review';
import Notification from '../models/Notification';
import { getIO } from '../socket';
import { AuthRequest } from '../middleware/auth';

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, techStack, budget, timeline } = req.body;
    const job = await Job.create({
      client: req.user!._id,
      title,
      description,
      techStack,
      budget,
      timeline,
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getJobs = async (req: AuthRequest, res: Response) => {
  try {
    const { status, tech, minBudget, maxBudget, page = '1', limit = '10' } = req.query;
    const filter: Record<string, unknown> = {};

    if (status) filter.status = status;
    if (tech) filter.techStack = { $in: (tech as string).split(',') };
    if (minBudget || maxBudget) {
      const budgetFilter: Record<string, number> = {};
      if (minBudget) budgetFilter.$gte = Number(minBudget);
      if (maxBudget) budgetFilter.$lte = Number(maxBudget);
      filter.budget = budgetFilter;
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const jobs = await Job.find(filter)
      .populate('client', 'name avatar')
      .populate('awardedTo', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Job.countDocuments(filter);

    res.json({ jobs, page: pageNum, pages: Math.ceil(total / limitNum), total });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getJobById = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('client', 'name avatar rating reviewCount')
      .populate('awardedTo', 'name avatar title skills');
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    let hasReviewed = false;
    let hasProposed = false;
    if (req.user) {
      const userId = req.user._id.toString();
      const isClient = job.client._id.toString() === userId;
      const isDev = job.awardedTo?._id?.toString() === userId;
      if (isClient || isDev) {
        const review = await Review.findOne({ job: job._id, reviewer: userId });
        hasReviewed = !!review;
      }
      if (job.status === 'open' && !isClient) {
        const proposal = await Proposal.findOne({ job: job._id, dev: userId });
        hasProposed = !!proposal;
      }
    }

    res.json({ ...job.toObject(), hasReviewed, hasProposed });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    if (job.client.toString() !== req.user!._id.toString() && !['moderator', 'super_admin'].includes(req.user!.role)) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const fields = ['title', 'description', 'techStack', 'budget', 'timeline', 'status'];
    for (const field of fields) {
      if (req.body[field] !== undefined) (job as any)[field] = req.body[field];
    }
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    if (job.client.toString() !== req.user!._id.toString() && !['moderator', 'super_admin'].includes(req.user!.role)) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }
    await Job.findByIdAndDelete(req.params.id);
    await Proposal.deleteMany({ job: req.params.id });
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const markComplete = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    if (job.client.toString() !== req.user!._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }
    if (job.status !== 'in_progress') {
      res.status(400).json({ message: 'Job is not in progress' });
      return;
    }
    job.status = 'completed';
    await job.save();

    if (job.awardedTo) {
      const notif = await Notification.create({
        recipient: job.awardedTo,
        type: 'job_completed',
        title: 'Job Completed',
        message: `"${job.title}" was marked complete by the client`,
        data: {
          jobId: job._id.toString(),
          actorId: req.user!._id.toString(),
          actorName: req.user!.name,
        },
      });
      getIO().to(`user:${job.awardedTo}`).emit('notification:new', notif);
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const submitWork = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    if (job.awardedTo?.toString() !== req.user!._id.toString()) {
      res.status(403).json({ message: 'Not authorized - job not awarded to you' });
      return;
    }
    if (job.status !== 'in_progress') {
      res.status(400).json({ message: 'Job is not in progress' });
      return;
    }
    const { submissionNote } = req.body;
    job.submissionNote = submissionNote || '';
    job.submittedAt = new Date();
    job.status = 'completed';
    await job.save();

    const notif = await Notification.create({
      recipient: job.client,
      type: 'work_submitted',
      title: 'Work Submitted',
      message: `${req.user!.name} submitted work on "${job.title}"`,
      data: {
        jobId: job._id.toString(),
        actorId: req.user!._id.toString(),
        actorName: req.user!.name,
        actorAvatar: req.user!.avatar,
      },
    });
    getIO().to(`user:${job.client}`).emit('notification:new', notif);

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMyJobs = async (req: AuthRequest, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.user!.role === 'client') {
      filter.client = req.user!._id;
    } else if (req.user!.role === 'dev') {
      filter.awardedTo = req.user!._id;
    }

    const jobs = await Job.find(filter)
      .populate('client', 'name avatar')
      .populate('awardedTo', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
