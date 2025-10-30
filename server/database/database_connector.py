# from sqlite3 import connect
from os.path import abspath, dirname, join

from constants import DATABASE_URL # DATABASE_NAME

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql+psycopg2://", "postgresql+asyncpg://")
DATA_FOLDER = join(dirname(dirname(abspath(__file__))), "data")
# DB_PATH = join(DATA_FOLDER, DATABASE_NAME)

# def ensure_created_db(db_name: str) -> None:
#     connection = connect(db_name)
#     connection.close()


# ensure_created_db(DB_PATH)

# engine = create_engine('sqlite:///'+DB_PATH)
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine, autocommit=False, autoflush=False)

async_engine = create_async_engine(ASYNC_DATABASE_URL, future=True, echo=True)
AsyncSessionLocal = sessionmaker(bind=async_engine, class_=AsyncSession, autocommit=False, autoflush=False)

def get_db_session():
    session = Session()
    try:
        yield session
    finally:
        session.close()


async def get_async_db_session():
    async with AsyncSessionLocal() as session:
        yield session

# session = Session()