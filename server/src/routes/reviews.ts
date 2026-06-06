import { Router } from 'express';
import { createReview, getReviewsForUser } from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/user/:userId', getReviewsForUser);
router.post('/:jobId', protect, createReview);

export default router;
