import { Router } from 'express';
import { getDevs, getDevById } from '../controllers/devController';

const router = Router();

router.get('/', getDevs);
router.get('/:id', getDevById);

export default router;
