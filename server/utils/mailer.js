const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify the email credentials as soon as the server starts, so a bad
// App Password shows up immediately instead of silently failing later.
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ Email transporter failed to verify:', err.message);
  } else {
    console.log('✅ Email transporter ready — can send mail from', process.env.EMAIL_USER);
  }
});

async function sendOrderConfirmationEmail(toEmail, order) {
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#1f2937;">
    <div style="background:#000;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
      <span style="color:#fff;font-size:20px;font-weight:bold;">Storefront</span>
    </div>
    <div style="padding:32px 24px;background:#ffffff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;text-align:center;">
      <h1 style="font-size:20px;margin:0 0 12px;">Thank you for your order!</h1>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 20px;">
        Hi ${order.shipping_name || 'there'}, we've received your order
        <strong>#${order.id}</strong> for <strong>$${Number(order.total_amount).toFixed(2)}</strong>.
        It'll arrive soon!
      </p>
      <p style="font-size:13px;color:#9ca3af;margin:0;">
        Placed on ${new Date(order.created_at).toLocaleDateString()}
      </p>
    </div>
  </div>`;

  console.log(`📧 Attempting to send confirmation email to ${toEmail}...`);

  const info = await transporter.sendMail({
    from: `"Storefront" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Thank you for your order — #${order.id}`,
    html,
  });

  console.log('✅ Email sent successfully. Message ID:', info.messageId);
  return info;
}

module.exports = { sendOrderConfirmationEmail };
