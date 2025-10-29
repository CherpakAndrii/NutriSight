# from sqlite3 import connect
from os.path import abspath, dirname, join

from constants import DATABASE_URL # DATABASE_NAME

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATA_FOLDER = join(dirname(dirname(abspath(__file__))), "data")
# DB_PATH = join(DATA_FOLDER, DATABASE_NAME)

# def ensure_created_db(db_name: str) -> None:
#     connection = connect(db_name)
#     connection.close()


# ensure_created_db(DB_PATH)

# engine = create_engine('sqlite:///'+DB_PATH)
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# session = Session()