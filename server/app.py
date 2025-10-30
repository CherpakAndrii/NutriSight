import os
import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
from filelock import FileLock, Timeout
import uvloop
import asyncio

from routers.auth_router import auth_router
from routers.user_profile_router import user_profile_router
from routers.food_log_router import food_log_router
from routers.additional_router import additional_router
from constants import SERVER_PORT, SERVER_WORKERS
from utils.launch_utils import configure_logging, configure_directories, configure_db_index


asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())

@asynccontextmanager
async def lifespan(application: FastAPI):
    # Perform startup tasks
    configure_logging()

    lock = FileLock("startup.lock")
    try:
        with lock.acquire(timeout=0):
            configure_directories()
    except Timeout:
        pass

    lock = FileLock("db-idx-init.lock")
    try:
        with lock.acquire(timeout=0):
            await configure_db_index()
    except Timeout:
        pass

    yield


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://192.168.0.101:3000",
    "http://localhost:8000",
    "http://192.168.0.101:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=4096)

# app.mount("/static", StaticFiles(directory="frontend/static", html=True), name="static")
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(user_profile_router, prefix="/api/profile", tags=["Profile"])
app.include_router(food_log_router, prefix="/api/food_log", tags=["Food Log"])
app.include_router(additional_router, tags=["Additional"])


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=SERVER_PORT)
