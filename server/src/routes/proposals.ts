import { Router } from 'express';
import {
  createProposal,
  getProposalsForJob,
  acceptProposal,
  getMyProposals,
} from '../controllers/proposalController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/my', protect, authorize('dev'), getMyProposals);

router.post('/:jobId', protect, authorize('dev'), createProposal);
router.get('/:jobId', protect, getProposalsForJob);
router.put('/:id/accept', protect, authorize('client'), acceptProposal);

export default router;
