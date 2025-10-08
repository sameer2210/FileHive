import dotenv from 'dotenv';
import { Resend } from 'resend';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM ,
      to,
      subject,
      html,
    });

    console.log('Email sent:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
