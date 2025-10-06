import express from 'express';

import { senedOpt, verifyOtp } from '../controllers/otp.controller.js';

const router = express.Router();

router.post('/send', senedOpt);
router.post('/verify', verifyOtp);

export default router;
