import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getUsers,
  getUserById,
  updateUser,
  suspendUser,
  resetPassword,
  verifyDev,
  verifyEmail,
} from '../controllers/adminController';
import {
  getAllJobs,
  getAdminJobById,
  updateJobStatus,
  getReports,
  createReport,
  resolveReport,
  removeContent,
} from '../controllers/moderationController';
import {
  getTransactions,
  refundTransaction,
} from '../controllers/adminTransactionController';

const router = Router();

// All admin routes require authentication + moderator or super_admin role
router.use(protect);
router.use(authorize('moderator', 'super_admin'));

// Users
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

// Super-admin only user actions
router.put('/users/:id', authorize('super_admin'), updateUser);
router.put('/users/:id/suspend', authorize('super_admin'), suspendUser);
router.post('/users/:id/reset-password', authorize('super_admin'), resetPassword);
router.put('/users/:id/verify-dev', authorize('super_admin'), verifyDev);
router.put('/users/:id/verify-email', authorize('super_admin'), verifyEmail);

// Jobs
router.get('/jobs', getAllJobs);
router.get('/jobs/:id', getAdminJobById);
router.put('/jobs/:id/status', updateJobStatus);

// Reports
router.get('/reports', getReports);
router.post('/reports', createReport);
router.put('/reports/:id', resolveReport);

// Content removal
router.delete('/content/:type/:id', removeContent);

// Transactions
router.get('/transactions', getTransactions);
router.put('/transactions/:id/refund', authorize('super_admin'), refundTransaction);

export default router;
