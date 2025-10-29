import os
from dotenv import load_dotenv


load_dotenv()


JWT_SECRET: str = os.getenv('JWT_SECRET')
JWT_ALGORITHM: str = os.getenv('JWT_ALGORITHM')
JWT_EXPIRATION: int = int(os.getenv('JWT_EXPIRATION'))
JWT_REFRESH: int = int(os.getenv('JWT_REFRESH'))

DATABASE_NAME: str = os.getenv('DATABASE_NAME')

SERVER_PORT: int = int(os.getenv('SERVER_PORT'))
SERVER_WORKERS: int = int(os.getenv('SERVER_WORKERS'))

log_dir = "data/logs"
