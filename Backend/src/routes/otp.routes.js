import express from 'express';

import { sendOpt, verifyOtp } from '../controllers/otp.controller.js';

const router = express.Router();

router.post('/send', sendOpt);
router.post('/verify', verifyOtp);

export default router;
