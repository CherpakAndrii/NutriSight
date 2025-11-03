import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from constants import SMTP_USER, SMTP_PASSWORD, SMTP_SERVER, SMTP_PORT, NGROK_HOSTING_URL

def send_verification_email(to_email: str, token: str):
    verification_link = f"https://{NGROK_HOSTING_URL}/verify/{token}"
    subject = "NutriSight: Verify your email"
    body = f"""
    <p>Hi!</p>
    <p>Click the link below to verify your email address:</p>
    <p><a href="{verification_link}">{verification_link}</a></p>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg.attach(MIMEText(body, "html"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
