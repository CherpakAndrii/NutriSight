import logging
from os.path import exists
from os import makedirs
from pathlib import Path

from utils.logging_utils import logger, access_handler, error_spec_handler


BASE_DIR = Path(__file__).resolve().parent.parent


def configure_directories():
    for subdir in ['cache', 'data/complete', 'csvs', 'healthcheck_tmp', 'data/healthcheck', 'data/logs', 'data/results']:
        if not exists(BASE_DIR / subdir):
            makedirs(BASE_DIR / subdir)

def configure_logging():
    logging.getLogger("filelock").setLevel(logging.DEBUG)
    uvicorn_logger = logging.getLogger("uvicorn")
    uvicorn_logger.handlers = logger.handlers
    uvicorn_logger.setLevel(logger.level)
    logging.getLogger("uvicorn.access").addHandler(access_handler)
    logging.getLogger("uvicorn.error").addHandler(error_spec_handler)