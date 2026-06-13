import { Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: req.user!._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ recipient: req.user!._id });
    const unreadCount = await Notification.countDocuments({ recipient: req.user!._id, read: false });

    res.json({
      notifications,
      page,
      pages: Math.ceil(total / limit),
      total,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const markRead = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    if (notification.recipient.toString() !== req.user!._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const markAllRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { recipient: req.user!._id, read: false },
      { read: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user!._id, read: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
