import { Router } from 'express';
import {
  getClientAnalytics,
  getDevAnalytics,
  getAdminAnalytics,
} from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/client', protect, authorize('client'), getClientAnalytics);
router.get('/dev', protect, authorize('dev'), getDevAnalytics);
router.get('/admin', protect, authorize('super_admin', 'moderator'), getAdminAnalytics);

export default router;
