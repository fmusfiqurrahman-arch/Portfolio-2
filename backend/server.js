require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const nodemailer = require('nodemailer');
const rateLimit  = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ─── Middleware ─── */
app.use(express.json());
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    methods: ['GET', 'POST']
}));

/* ─── Rate-limit: 5 submissions per 15 min per IP ─── */
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many messages sent. Please try again in 15 minutes.' }
});

/* ─── Email transporter ─── */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/* ─── POST /api/contact ─── */
app.post('/api/contact', contactLimiter, async (req, res) => {
    const { name, email, message, service } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const safeMessage = String(message).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeName    = String(name).replace(/</g, '&lt;').replace(/>/g, '&gt;');

    try {
        /* Notification email → photographer */
        await transporter.sendMail({
            from:    `"MRF Photography" <${process.env.EMAIL_USER}>`,
            to:      process.env.PHOTOGRAPHER_EMAIL || process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Inquiry from ${safeName}${service ? ` — ${service}` : ''}`,
            html: `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px;background:#fafaf8;border:1px solid #e8e6e0;">
  <h2 style="font-family:Georgia,serif;color:#1a1a1a;margin:0 0 4px;">New Inquiry</h2>
  <p style="color:#9a9a9a;font-size:13px;margin:0 0 28px;padding-bottom:16px;border-bottom:1px solid #e8e6e0;font-family:sans-serif;">MRF Photography — Contact Form</p>

  <table style="width:100%;border-collapse:collapse;font-family:sans-serif;">
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ede8;color:#9a9a9a;width:110px;font-size:11px;text-transform:uppercase;letter-spacing:.1em;">Name</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ede8;color:#1a1a1a;font-size:14px;">${safeName}</td>
    </tr>
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ede8;color:#9a9a9a;font-size:11px;text-transform:uppercase;letter-spacing:.1em;">Email</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-size:14px;"><a href="mailto:${email}" style="color:#c9a661;">${email}</a></td>
    </tr>
    ${service ? `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ede8;color:#9a9a9a;font-size:11px;text-transform:uppercase;letter-spacing:.1em;">Service</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ede8;color:#1a1a1a;font-size:14px;">${service}</td>
    </tr>` : ''}
  </table>

  <div style="margin-top:24px;font-family:sans-serif;">
    <p style="color:#9a9a9a;font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">Message</p>
    <p style="color:#1a1a1a;line-height:1.8;font-size:14px;white-space:pre-wrap;">${safeMessage}</p>
  </div>

  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e8e6e0;">
    <a href="mailto:${email}?subject=Re%3A%20Your%20inquiry%20%E2%80%94%20MRF%20Photography"
       style="display:inline-block;padding:12px 26px;background:#c9a661;color:#fff;text-decoration:none;font-family:sans-serif;font-size:13px;letter-spacing:.08em;">
      Reply to ${safeName}
    </a>
  </div>
</div>`
        });

        /* Confirmation email → client */
        await transporter.sendMail({
            from:    `"Musfiqur Rahman Fahim" <${process.env.EMAIL_USER}>`,
            to:      email,
            subject: 'Thank you — I received your message',
            html: `
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:48px 40px;background:#fafaf8;">
  <p style="font-family:sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:.2em;color:#c9a661;margin:0 0 24px;">MRF Photography</p>
  <h2 style="font-size:1.8rem;font-weight:400;color:#1a1a1a;margin:0 0 20px;line-height:1.2;">Thank you, ${safeName}.</h2>
  <p style="font-family:sans-serif;color:#5a5a5a;line-height:1.9;font-size:14px;margin:0 0 16px;">
    I've received your message and I'm already looking forward to reading your story.
  </p>
  <p style="font-family:sans-serif;color:#5a5a5a;line-height:1.9;font-size:14px;margin:0 0 32px;">
    I personally respond to every inquiry within 24 hours. If you need to reach me sooner, simply reply to this email.
  </p>
  <p style="font-style:italic;color:#c9a661;font-size:1.1rem;margin:0 0 40px;padding-left:16px;border-left:2px solid #c9a661;">
    "I don't photograph weddings. I photograph the love inside them."
  </p>
  <p style="font-family:sans-serif;color:#5a5a5a;font-size:14px;margin:0;">
    Warmly,<br>
    <strong style="color:#1a1a1a;font-family:Georgia,serif;font-size:1.05rem;font-weight:400;">Musfiqur Rahman Fahim</strong><br>
    <span style="color:#9a9a9a;font-size:12px;">Wedding &amp; Portrait Photographer — Dhaka, Bangladesh</span>
  </p>
</div>`
        });

        return res.json({ success: true, message: 'Message sent.' });

    } catch (err) {
        console.error('Email error:', err.message);
        return res.status(500).json({ success: false, message: 'Could not send message. Please email directly.' });
    }
});

/* ─── Health check ─── */
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`MRF Photography server → http://localhost:${PORT}`);
});
