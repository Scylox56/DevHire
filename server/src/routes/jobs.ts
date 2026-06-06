import { Router } from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  markComplete,
  submitWork,
} from '../controllers/jobController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorize('client'), createJob);

router.get('/my', protect, getMyJobs);

router.post('/:id/submit-work', protect, authorize('dev'), submitWork);
router.put('/:id/complete', protect, authorize('client'), markComplete);

router.route('/:id')
  .get(getJobById)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

export default router;
