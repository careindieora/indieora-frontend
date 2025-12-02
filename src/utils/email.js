// utils/email.js
import sgMailPkg from '@sendgrid/mail';
const sgMail = sgMailPkg;

const FROM_EMAIL = process.env.FROM_EMAIL || 'Indieora <care.indieora@gmail.com>';

export function initSendGrid() {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) {
    console.warn('SENDGRID_API_KEY not set — emails will be logged not sent.');
    return false;
  }
  sgMail.setApiKey(key);
  return true;
}

/**
 * Send OTP email via SendGrid. Throws on fatal error.
 * Returns an object { ok: true, statusCode } on success.
 */
export async function sendOtpEmail(to, otp) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    // fallback: just log the OTP (useful for dev)
    console.log(`[Email fallback] OTP for ${to}: ${otp}`);
    return { ok: false, fallback: true };
  }

  const msg = {
    to,
    from: FROM_EMAIL,
    subject: 'Indieora — Your verification code',
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.4">
        <h3 style="margin-bottom:0.2em">Indieora verification</h3>
        <p style="margin:0.2em 0 0.6em">Your verification code is</p>
        <p style="font-size:20px;letter-spacing:4px; font-weight:700; margin:0.2em 0">${otp}</p>
        <p style="color:#666;font-size:12px;margin-top:0.8em">This code expires in 10 minutes.</p>
      </div>
    `,
  };

  const res = await sgMail.send(msg);
  const status = Array.isArray(res) && res[0] && res[0].statusCode ? res[0].statusCode : null;
  return { ok: true, statusCode: status };
}
