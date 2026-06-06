import { Request, Response } from 'express';
import stripe from '../config/stripe';
import Transaction from '../models/Transaction';
import Job from '../models/Job';
import { AuthRequest } from '../middleware/auth';

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId).populate('awardedTo');

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    if (job.client.toString() !== req.user!._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }
    if (job.status !== 'in_progress' || !job.awardedTo) {
      res.status(400).json({ message: 'Job is not in a payable state' });
      return;
    }

    const existingTx = await Transaction.findOne({ job: jobId, status: { $in: ['pending', 'held'] } });
    if (existingTx) {
      res.status(400).json({ message: 'Payment already initiated for this job' });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(job.budget * 100),
      currency: 'usd',
      metadata: { jobId: job._id.toString() },
    });

    const transaction = await Transaction.create({
      job: jobId,
      client: job.client,
      dev: job.awardedTo._id,
      amount: job.budget,
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending',
    });

    res.json({ clientSecret: paymentIntent.client_secret, transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const releasePayment = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('job');
    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    const job = await Job.findById(transaction.job);
    if (!job || job.client.toString() !== req.user!._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await stripe.paymentIntents.capture(transaction.stripePaymentIntentId);

    transaction.status = 'released';
    await transaction.save();

    job.status = 'completed';
    await job.save();

    res.json({ message: 'Payment released', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { client: req.user!._id },
        { dev: req.user!._id },
      ],
    })
      .populate('client', 'name avatar')
      .populate('dev', 'name avatar')
      .populate('job', 'title')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    res.status(400).json({ message: 'Webhook signature verification failed' });
    return;
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await Transaction.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { status: 'held' }
    );
  }

  res.json({ received: true });
};
