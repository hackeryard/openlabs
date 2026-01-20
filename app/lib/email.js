import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const WEBSITE_NAME = "OpenLabs"
const WEBSITE_URL = process.env.WEBSITE_URL || "https://openlabs.com"

export async function sendOTPEmail(email, otp, subject = "Email Verification - Your OTP Code") {
  try {
    const isPasswordReset = subject.includes("Password Reset")
    const title = isPasswordReset ? "Password Reset Request" : "Verify Your Email"
    const message = isPasswordReset 
      ? "We received a request to reset your password. Use the secure code below to proceed."
      : "Welcome! Please verify your email address to complete your registration."
    const expiry = isPasswordReset ? "15 minutes" : "10 minutes"

    const mailOptions = {
      from: `${WEBSITE_NAME} <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
              color: white;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
            }
            .title {
              color: #1f2937;
              font-size: 24px;
              font-weight: 600;
              margin: 0 0 16px 0;
            }
            .message {
              color: #4b5563;
              font-size: 16px;
              line-height: 1.5;
              margin: 0 0 32px 0;
            }
            .otp-container {
              background: linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%);
              border: 2px dashed #4f46e5;
              padding: 32px 20px;
              border-radius: 8px;
              text-align: center;
              margin: 32px 0;
            }
            .otp-label {
              font-size: 13px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 12px;
              display: block;
            }
            .otp-code {
              color: #4f46e5;
              font-size: 44px;
              font-weight: 700;
              letter-spacing: 8px;
              margin: 0;
              font-family: 'Courier New', monospace;
              word-break: break-all;
            }
            .expiry {
              color: #6b7280;
              font-size: 14px;
              margin: 16px 0 0 0;
            }
            .info-section {
              background: #f9fafb;
              border-left: 4px solid #4f46e5;
              padding: 16px;
              margin: 32px 0;
              border-radius: 4px;
            }
            .info-section p {
              margin: 0;
              color: #4b5563;
              font-size: 14px;
              line-height: 1.6;
            }
            .footer {
              background: #f3f4f6;
              padding: 24px 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer-text {
              color: #6b7280;
              font-size: 13px;
              margin: 0;
            }
            .footer-link {
              color: #4f46e5;
              text-decoration: none;
            }
            .footer-link:hover {
              text-decoration: underline;
            }
            .brand {
              color: #4f46e5;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>${WEBSITE_NAME}</h1>
            </div>

            <!-- Content -->
            <div class="content">
              <h2 class="title">${title}</h2>
              <p class="message">${message}</p>

              <!-- OTP Code -->
              <div class="otp-container">
                <span class="otp-label">Your verification code</span>
                <p class="otp-code">${otp}</p>
                <p class="expiry">Valid for ${expiry}</p>
              </div>

              <!-- Info Section -->
              <div class="info-section">
                <p>🔒 <strong>Security Note:</strong> Never share this code with anyone. ${WEBSITE_NAME} staff will never ask for your OTP code.</p>
              </div>

              <!-- Instructions -->
              <div>
                <p style="color: #4b5563; font-size: 14px; margin: 0 0 12px 0;"><strong>What to do next:</strong></p>
                <ul style="color: #4b5563; font-size: 14px; margin: 0; padding-left: 24px;">
                  <li style="margin-bottom: 8px;">Enter this code in the ${isPasswordReset ? 'password reset' : 'verification'} window on our website</li>
                  <li style="margin-bottom: 8px;">If you didn't initiate this request, you can safely ignore this email</li>
                  <li>Your code will expire after ${expiry}</li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p class="footer-text">
                © ${new Date().getFullYear()} <span class="brand">${WEBSITE_NAME}</span>. All rights reserved.<br>
                <a href="${WEBSITE_URL}" class="footer-link">Visit our website</a>
              </p>
              <p class="footer-text" style="margin-top: 12px; font-size: 12px;">
                This is an automated email. Please do not reply to this message.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error("Email sending error:", error)
    throw new Error("Failed to send OTP email")
  }
}

