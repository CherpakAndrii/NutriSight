import os
from dotenv import load_dotenv


load_dotenv()


JWT_SECRET: str = os.getenv('JWT_SECRET')
JWT_ALGORITHM: str = os.getenv('JWT_ALGORITHM')
JWT_EXPIRATION: int = int(os.getenv('JWT_EXPIRATION'))
JWT_REFRESH: int = int(os.getenv('JWT_REFRESH'))
VERIFY_EXPIRATION: int = int(os.getenv('VERIFY_EXPIRATION'))

SERVER_PORT: int = int(os.getenv('SERVER_PORT'))
SERVER_WORKERS: int = int(os.getenv('SERVER_WORKERS'))

POSTGRES_USER: str = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD: str = os.getenv('POSTGRES_PASSWORD')
POSTGRES_DB: str = os.getenv('POSTGRES_DB')
POSTGRES_HOST: str = os.getenv('POSTGRES_HOST')
POSTGRES_PORT: str = os.getenv('POSTGRES_PORT')

SMTP_USER: str = os.getenv("SMTP_USER")
SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD")
SMTP_SERVER: str = os.getenv("SMTP_SERVER")
SMTP_PORT: int = int(os.getenv("SMTP_PORT"))

GOOGLE_CLIENT_ID: str = os.getenv('GOOGLE_CLIENT_ID')
GEMINI_API_KEY: str = os.getenv('GEMINI_API_KEY')

DATABASE_URL: str = os.getenv('DATABASE_URL')

NGROK_HOSTING_URL: str = os.getenv('NGROK_HOSTING_URL')


log_dir = "data/logs"
