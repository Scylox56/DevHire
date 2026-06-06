import { Request, Response } from 'express';
import User from '../models/User';

export const getDevs = async (req: Request, res: Response) => {
  try {
    const { skill, minRate, maxRate, page = '1', limit = '10' } = req.query;
    const filter: Record<string, unknown> = { role: 'dev' };

    if (skill) filter.skills = { $in: (skill as string).split(',') };
    if (minRate || maxRate) {
      const rateFilter: Record<string, number> = {};
      if (minRate) rateFilter.$gte = Number(minRate);
      if (maxRate) rateFilter.$lte = Number(maxRate);
      filter.hourlyRate = rateFilter;
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const devs = await User.find(filter)
      .select('name avatar title skills hourlyRate rating reviewCount completedJobs bio')
      .sort({ rating: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await User.countDocuments(filter);

    res.json({ devs, page: pageNum, pages: Math.ceil(total / limitNum), total });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getDevById = async (req: Request, res: Response) => {
  try {
    const dev = await User.findOne({ _id: req.params.id, role: 'dev' })
      .select('-password');
    if (!dev) {
      res.status(404).json({ message: 'Developer not found' });
      return;
    }
    res.json(dev);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
