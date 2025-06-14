import nodemailer from "nodemailer";
import type { EmailResponse } from "@/lib/types/auth-types";

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST || "smtp.example.com",
  port: Number.parseInt(process.env.BREVO_PORT || "587"),
  secure: process.env.NODE_ENV !== "production",
  requireTLS: true,
  auth: {
    user: process.env.BREVO_USER || "user@example.com",
    pass: process.env.BREVO_PASSWORD || "password",
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

if (process.env.NODE_ENV === 'development') {
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP connection error:', error);
    } else {
      console.log('SMTP server is ready to take our messages');
    }
  });
}

export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<EmailResponse> {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@example.com",
    to: email,
    subject: "Verify your email address",
    text: `Your verification code is: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your email address</h2>
        <p>Thank you for signing up! Please use the following code to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          <strong>${code}</strong>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this verification, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
