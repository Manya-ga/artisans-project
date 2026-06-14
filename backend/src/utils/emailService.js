const nodemailer = require('nodemailer');
const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// ── Transporter Setup ──────────────────────────────────────────────────────
function createTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

// ── Send OTP Email ─────────────────────────────────────────────────────────
async function sendVerificationEmail(toEmail, displayName, otp) {
  console.log(`\n[EmailService] ─────────────────────────────────`);
  console.log(`[EmailService] To: ${toEmail}`);
  console.log(`[EmailService] OTP: ${otp}`);
  console.log(`[EmailService] ─────────────────────────────────\n`);

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, sans-serif; background: #f9fafb; margin:0; padding: 40px 20px;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #111827, #312e81); padding: 40px; text-align: center;">
          <div style="display:inline-flex; align-items:center; gap:8px;">
            <div style="width:40px;height:40px;background:#ec4899;border-radius:12px;display:flex;align-items:center;justify-content:center;">
              <span style="color:white;font-size:20px;">🎨</span>
            </div>
            <span style="color:white;font-size:22px;font-weight:900;letter-spacing:-0.5px;">Artisan<span style="color:#f9a8d4;">Connect</span></span>
          </div>
        </div>
        <div style="padding: 40px;">
          <h1 style="color:#111827;font-size:24px;font-weight:900;margin:0 0 8px;">Verify Your Email</h1>
          <p style="color:#6b7280;font-size:15px;margin:0 0 32px;">Hi ${displayName}, use the code below to verify your account.</p>
          <div style="background:#f3f4f6;border-radius:16px;padding:28px;text-align:center;margin-bottom:32px;">
            <span style="font-size:42px;font-weight:900;letter-spacing:12px;color:#111827;font-family:monospace;">${otp}</span>
          </div>
          <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0;">This code expires in <strong>10 minutes</strong>.<br>If you did not sign up, ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Try Resend first
  if (resend) {
    try {
      const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
      const { data, error } = await resend.emails.send({
        from: `ArtisanConnect <${fromEmail}>`,
        to: toEmail,
        subject: 'Your ArtisanConnect Verification Code',
        html,
      });
      if (error) throw error;
      console.log('[EmailService] Email sent successfully via Resend');
      return { success: true, mode: 'resend' };
    } catch (err) {
      console.error('[EmailService] Resend failed:', err.message);
      // Fall through to try nodemailer
    }
  }

  // 2. Try Nodemailer
  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"ArtisanConnect" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: 'Your ArtisanConnect Verification Code',
        html,
      });
      console.log('[EmailService] Email sent successfully via Gmail SMTP');
      return { success: true, mode: 'smtp' };
    } catch (err) {
      console.error('[EmailService] Gmail SMTP failed:', err.message);
      throw new Error('Email delivery failed'); // Throw to properly handle failures
    }
  }

  // 3. Fallback to console in dev mode
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[EmailService] No email credentials found. Relying on console output for dev.');
    return { success: true, mode: 'console' };
  } else {
    throw new Error('Email delivery failed: No email credentials configured in production.');
  }
}

module.exports = { sendVerificationEmail };
