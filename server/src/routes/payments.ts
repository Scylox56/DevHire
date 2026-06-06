import { Router, raw } from 'express';
import {
  createPaymentIntent,
  releasePayment,
  getTransactions,
  stripeWebhook,
} from '../controllers/paymentController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/webhook', raw({ type: 'application/json' }), stripeWebhook);
router.post('/create-payment-intent', protect, authorize('client'), createPaymentIntent);
router.put('/:id/release', protect, authorize('client'), releasePayment);
router.get('/transactions', protect, getTransactions);

export default router;
