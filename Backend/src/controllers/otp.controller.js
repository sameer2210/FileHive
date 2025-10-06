import crypto from 'crypto';
import Otp from '../models/otp.model.js';
import { sendEmail } from '../utils/sendEmail.js';

export const senedOpt = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, expiresAt });

    await sendEmail({
      to: email,
      subject: 'your otp is ',
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error instanceof Error ? error.message : String(error) });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email, otp });

    if (!record) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (record.expiresAt < new Date())
      return res.status(400).json({ success: false, message: 'OTP expired' });

    await Otp.deleteMany({ email });
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


