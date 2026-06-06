import { Response } from 'express';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import Job from '../models/Job';
import { AuthRequest } from '../middleware/auth';

export const getConversationByJob = async (req: AuthRequest, res: Response) => {
  try {
    let conversation = await Conversation.findOne({
      job: req.params.jobId,
      $or: [
        { client: req.user!._id },
        { dev: req.user!._id },
      ],
    })
      .populate('client', 'name avatar')
      .populate('dev', 'name avatar')
      .populate('job', 'title');

    if (!conversation) {
      const job = await Job.findById(req.params.jobId).select('client awardedTo');
      if (!job || !job.awardedTo) {
        res.status(404).json({ message: 'Conversation not found' });
        return;
      }
      conversation = await Conversation.create({
        job: job._id,
        client: job.client,
        dev: job.awardedTo,
      });
      await conversation.populate('client', 'name avatar');
      await conversation.populate('dev', 'name avatar');
      await conversation.populate('job', 'title');
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await Conversation.find({
      $or: [
        { client: req.user!._id },
        { dev: req.user!._id },
      ],
    })
      .populate('client', 'name avatar')
      .populate('dev', 'name avatar')
      .populate('job', 'title')
      .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    const userId = req.user!._id.toString();
    if (
      conversation.client.toString() !== userId &&
      conversation.dev.toString() !== userId
    ) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await Message.updateMany(
      { conversation: req.params.conversationId, sender: { $ne: req.user!._id }, read: false },
      { read: true }
    );

    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    const userId = req.user!._id.toString();
    if (
      conversation.client.toString() !== userId &&
      conversation.dev.toString() !== userId
    ) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const message = await Message.create({
      conversation: req.params.conversationId,
      sender: req.user!._id,
      content,
    });

    conversation.lastMessage = content;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populated = await message.populate('sender', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
