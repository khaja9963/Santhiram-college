import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.core.config import settings

logger = logging.getLogger("srec.email")

def _send_email_smtp(to_email: str, subject: str, html_content: str, text_content: str = "") -> bool:
    """
    Sends an email using SMTP if configured, otherwise falls back to logging.
    """
    if not settings.EMAIL_USERNAME or not settings.EMAIL_PASSWORD:
        logger.info(
            f"\n==================== [DEV EMAIL - SMTP NOT CONFIGURED] ====================\n"
            f"To: {to_email}\n"
            f"Subject: {subject}\n"
            f"Body:\n{text_content or html_content}\n"
            f"============================================================================\n"
        )
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>"
        msg["To"] = to_email

        if text_content:
            part1 = MIMEText(text_content, "plain")
            msg.attach(part1)
        part2 = MIMEText(html_content, "html")
        msg.attach(part2)

        server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
        server.ehlo()
        server.starttls()
        server.login(settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD)
        server.sendmail(settings.EMAIL_FROM, [to_email], msg.as_string())
        server.quit()
        logger.info(f"Email successfully sent to {to_email} via SMTP")
        return True
    except Exception as e:
        logger.error(f"Failed to send email via SMTP to {to_email}: {e}")
        # Always output to logger so local dev isn't blocked
        logger.info(
            f"\n==================== [FALLBACK LOGGED EMAIL] ====================\n"
            f"To: {to_email}\n"
            f"Subject: {subject}\n"
            f"Body:\n{text_content or html_content}\n"
            f"=================================================================\n"
        )
        return False


def _get_base_template(title: str, content: str) -> str:
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{title}</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }}
    .header {{ background: linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%); color: #ffffff; padding: 24px; text-align: center; }}
    .header h1 {{ margin: 0 0 6px; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }}
    .header p {{ margin: 0; font-size: 13px; opacity: 0.9; }}
    .body-content {{ padding: 32px 28px; }}
    .btn {{ display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 20px 0; text-align: center; }}
    .footer {{ background: #f1f5f9; padding: 18px 24px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }}
    .code-box {{ background: #f8fafc; border: 1px dashed #cbd5e1; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 15px; font-weight: bold; color: #0f172a; margin: 12px 0; display: inline-block; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SANTHIRAM ENGINEERING COLLEGE (AUTONOMOUS)</h1>
      <p>SREC SMART CAMPUS | NANDYAL, ANDHRA PRADESH</p>
    </div>
    <div class="body-content">
      {content}
    </div>
    <div class="footer">
      <p>&copy; 2026 Santhiram Engineering College (SREC Autonomous), NH-40, Nandyal - 518501, A.P.</p>
      <p>This is an automated notification from SREC Smart Campus. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>"""


def send_activation_email(email: str, name: str, user_code: str, activation_token: str) -> bool:
    activation_link = f"{settings.FRONTEND_URL}/activate-account?token={activation_token}"
    subject = "Activate Your SREC Smart Campus Account"
    
    html = _get_base_template(
        "Activate Your Account",
        f"""
        <h2 style="color: #0f172a; margin-top: 0;">Welcome to SREC Smart Campus, {name}!</h2>
        <p>An official institutional account has been created for you by the College Administration.</p>
        <p>Your institutional College ID / User Code is: <br><span class="code-box">{user_code}</span></p>
        <p>To activate your account and set up your secure password, please click the button below within 72 hours:</p>
        <div style="text-align: center;">
          <a href="{activation_link}" class="btn" target="_blank">Activate SREC Account</a>
        </div>
        <p style="font-size: 13px; color: #64748b;">If the button above does not work, copy and paste this link into your browser:</p>
        <p style="font-size: 12px; color: #2563eb; word-break: break-all;"><a href="{activation_link}">{activation_link}</a></p>
        <p style="font-size: 12px; color: #ef4444; margin-top: 20px;">* Note: Do not share this activation link with anyone. It is unique to your identity.</p>
        """
    )
    text = f"Welcome {name},\n\nYour SREC account ({user_code}) has been created. Activate it here: {activation_link}\n\nValid for 72 hours."
    return _send_email_smtp(email, subject, html, text)


def send_password_reset_email(email: str, name: str, reset_token: str) -> bool:
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    subject = "SREC Smart Campus Password Reset Request"

    html = _get_base_template(
        "Reset Your Password",
        f"""
        <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request</h2>
        <p>Hello {name},</p>
        <p>We received a request to reset your password for your SREC Smart Campus account. Click the button below to choose a new password:</p>
        <div style="text-align: center;">
          <a href="{reset_link}" class="btn" target="_blank">Reset Password</a>
        </div>
        <p style="font-size: 13px; color: #64748b;">This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
        <p style="font-size: 12px; color: #2563eb; word-break: break-all;"><a href="{reset_link}">{reset_link}</a></p>
        """
    )
    text = f"Hello {name},\n\nReset your SREC password here: {reset_link}\n\nExpires in 1 hour. If you didn't request this, ignore."
    return _send_email_smtp(email, subject, html, text)


def send_account_recovery_email(email: str, name: str, user_code: str, recovery_token: str) -> bool:
    activation_link = f"{settings.FRONTEND_URL}/activate-account?token={recovery_token}"
    subject = "SREC Smart Campus Account Recovery"

    html = _get_base_template(
        "Account Recovery",
        f"""
        <h2 style="color: #0f172a; margin-top: 0;">Account Recovery Initiated</h2>
        <p>Hello {name},</p>
        <p>The College Administration has re-issued an account activation/recovery link for your User ID <strong>{user_code}</strong>.</p>
        <div style="text-align: center;">
          <a href="{activation_link}" class="btn" target="_blank">Recover & Set Password</a>
        </div>
        <p style="font-size: 13px; color: #64748b;">Previous activation or reset tokens have been revoked for your security.</p>
        """
    )
    text = f"Hello {name},\n\nYour account recovery link for {user_code} is: {activation_link}"
    return _send_email_smtp(email, subject, html, text)


def send_status_change_email(email: str, name: str, new_status: str, reason: Optional[str] = None) -> bool:
    subject = f"SREC Smart Campus Account Status Update: {new_status}"
    reason_html = f"<p><strong>Reason:</strong> {reason}</p>" if reason else ""
    html = _get_base_template(
        "Account Status Update",
        f"""
        <h2 style="color: #0f172a; margin-top: 0;">Account Status Changed</h2>
        <p>Dear {name},</p>
        <p>Your institutional account status has been updated to: <strong style="color: #2563eb;">{new_status}</strong>.</p>
        {reason_html}
        <p>If you have any questions or believe this is an error, please contact the SREC Administration Office or Examination Cell.</p>
        """
    )
    text = f"Hello {name},\n\nYour SREC account status has changed to: {new_status}.\nReason: {reason or 'N/A'}"
    return _send_email_smtp(email, subject, html, text)
