import { Router } from 'express';
const router = Router();

import songRoutes from '/Users/gabriel11harris030/Downloads/class/Project-3/server/src/routes/api/songRoutes.js';

router.use('/api/songs', songRoutes);

export default router;
