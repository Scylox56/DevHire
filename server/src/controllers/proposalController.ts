import { Response } from 'express';
import Proposal from '../models/Proposal';
import Job, { IJob } from '../models/Job';
import Conversation from '../models/Conversation';
import { AuthRequest } from '../middleware/auth';

export const createProposal = async (req: AuthRequest, res: Response) => {
  try {
    const { coverLetter, bidAmount, estimatedTimeline } = req.body;
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    if (job.status !== 'open') {
      res.status(400).json({ message: 'Job is not open for proposals' });
      return;
    }
    if (job.client.toString() === req.user!._id.toString()) {
      res.status(400).json({ message: 'Cannot propose on your own job' });
      return;
    }

    const existing = await Proposal.findOne({ job: req.params.jobId, dev: req.user!._id });
    if (existing) {
      res.status(400).json({ message: 'Already proposed on this job' });
      return;
    }

    const proposal = await Proposal.create({
      job: req.params.jobId,
      dev: req.user!._id,
      coverLetter,
      bidAmount,
      estimatedTimeline,
    });

    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProposalsForJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    if (job.client.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const proposals = await Proposal.find({ job: req.params.jobId })
      .populate('dev', 'name avatar title skills hourlyRate rating reviewCount')
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const acceptProposal = async (req: AuthRequest, res: Response) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('job');
    if (!proposal) {
      res.status(404).json({ message: 'Proposal not found' });
      return;
    }
    const job = proposal.job as unknown as IJob;
    if (job.client.toString() !== req.user!._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    proposal.status = 'accepted';
    await proposal.save();

    await Job.findByIdAndUpdate(job._id, {
      status: 'in_progress',
      awardedTo: proposal.dev,
    });

    await Proposal.updateMany(
      { job: job._id, _id: { $ne: proposal._id } },
      { status: 'rejected' }
    );

    await Conversation.findOneAndUpdate(
      { job: job._id, client: job.client, dev: proposal.dev },
      { job: job._id, client: job.client, dev: proposal.dev, lastMessage: '', lastMessageAt: new Date() },
      { upsert: true, new: true }
    );

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMyProposals = async (req: AuthRequest, res: Response) => {
  try {
    const proposals = await Proposal.find({ dev: req.user!._id })
      .populate({
        path: 'job',
        populate: { path: 'client', select: 'name avatar' },
      })
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
