import { Response } from 'express';
import Review from '../models/Review';
import Job from '../models/Job';
import User from '../models/User';
import Notification from '../models/Notification';
import { getIO } from '../socket';
import { AuthRequest } from '../middleware/auth';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    if (job.status !== 'completed') {
      res.status(400).json({ message: 'Job must be completed to review' });
      return;
    }

    const userId = req.user!._id.toString();
    const isClient = job.client.toString() === userId;
    const isDev = job.awardedTo?.toString() === userId;

    if (!isClient && !isDev) {
      res.status(403).json({ message: 'Not part of this job' });
      return;
    }

    const existing = await Review.findOne({ job: req.params.jobId, reviewer: userId });
    if (existing) {
      res.status(400).json({ message: 'Already reviewed this job' });
      return;
    }

    const reviewee = isClient ? job.awardedTo : job.client;

    const review = await Review.create({
      job: req.params.jobId,
      reviewer: userId,
      reviewee,
      rating,
      comment,
      role: isClient ? 'client' : 'dev',
    });

    const stats = await Review.aggregate([
      { $match: { reviewee: reviewee } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await User.findByIdAndUpdate(reviewee, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        reviewCount: stats[0].count,
      });
    }

    const notif = await Notification.create({
      recipient: reviewee,
      type: 'review_received',
      title: 'New Review',
      message: `${req.user!.name} left a ${rating}-star review on "${job.title}"`,
      data: {
        jobId: job._id.toString(),
        reviewId: review._id.toString(),
        actorId: req.user!._id.toString(),
        actorName: req.user!.name,
        actorAvatar: req.user!.avatar,
      },
    });
    getIO().to(`user:${reviewee}`).emit('notification:new', notif);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getReviewsForUser = async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar')
      .populate('job', 'title')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
