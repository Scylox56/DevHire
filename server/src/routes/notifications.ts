import { Router } from 'express';
import { getNotifications, markRead, markAllRead, getUnreadCount } from '../controllers/notificationController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/read-all', protect, markAllRead);
router.put('/:id/read', protect, markRead);

export default router;
