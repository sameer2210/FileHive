import crypto from 'crypto';
import Otp from '../models/otp.model.js';
import { sendEmail } from '../utils/sendEmail.js';

export const senedOpt = async (req, res) => {
  try {
    console.log('Incoming body:', req.body);
    const { email, name } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, expiresAt });

    await sendEmail({
      to: email,
      subject: 'FileHive Email Verification Code',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9fafb; padding: 40px 0;">
          <div style="max-width: 480px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📂 FileHive</h1>
              <p style="color: #e0e7ff; margin: 4px 0 0;">Cloud Storage Authentication</p>
            </div>

            <div style="padding: 30px; text-align: left;">
              <h2 style="color: #111827; font-size: 18px; margin-bottom: 10px;">Hi ${name}</h2>
              <p style="color: #374151; font-size: 15px; line-height: 1.6;">
                Use the following One-Time Password (OTP) to verify your email address for <b>FileHive – Cloud Storage</b>.
                </b>.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; border-radius: 8px; font-size: 24px; font-weight: 600; letter-spacing: 4px;">
                  ${otp}
                </div>
              </div>

              <p style="color: #6b7280; font-size: 14px;">
                <b>This code is valid for <b>5 minutes</b>.<br>
                If you didn’t request this, you can safely ignore this email.
                Someone else might have entered your email by mistake.
              </p>
            </div>

            <div style="background: #f3f4f6; padding: 16px; text-align: center; font-size: 13px; color: #6b7280;">
              <p style="margin: 0;">
                © ${new Date().getFullYear()} FileHive – Cloud Storage
                <br />Built with Resend ❤️ sam
              </p>
            </div>
          </div>
        </div>
      `,
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
    const user = await User.findOne({ email });
    if (user) {
      user.isVerified = true;
      await user.save();
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
