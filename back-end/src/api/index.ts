import express from 'express';

import statistics from './statistics';

const router = express.Router();

router.use('/statistics', statistics);

export default router;
