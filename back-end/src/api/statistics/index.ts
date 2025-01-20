import express from 'express';

import competitions from './competitions';

const router = express.Router();

router.use('/competitions', competitions);

export default router;
