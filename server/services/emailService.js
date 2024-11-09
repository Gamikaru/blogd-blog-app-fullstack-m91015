import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send verification email
export const sendVerificationEmail = async (user, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking the link below:</p><p><a href="${verificationUrl}">Verify Email</a></p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', user.email);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

// Send password reset email
export const sendResetPasswordEmail = async (user, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset',
        html: `<p>Please reset your password by clicking the link below:</p><p><a href="${resetUrl}">Reset Password</a></p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', user.email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};