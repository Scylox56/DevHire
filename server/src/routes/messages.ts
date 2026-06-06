import { Router } from 'express';
import { getConversations, getConversationByJob, getMessages, sendMessage } from '../controllers/messageController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/conversations', protect, getConversations);
router.get('/conversations/job/:jobId', protect, getConversationByJob);
router.get('/conversations/:conversationId', protect, getMessages);
router.post('/conversations/:conversationId', protect, sendMessage);

export default router;
