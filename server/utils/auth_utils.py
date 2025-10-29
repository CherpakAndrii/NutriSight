from hashlib import shake_256
from time import time

import jwt
from fastapi import Request

from constants import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION, JWT_REFRESH
from database.mysql_connector import Session
from database.models import User


def hash_password(password: str) -> str:
    return shake_256(password.encode('utf-8')).hexdigest(10)


def generate_auth_token(user_id: int, expires_in: int = JWT_EXPIRATION) -> str:
    return jwt.encode(
            {'id': user_id, "exp": time() + expires_in},
            JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_auth_token(request: Request) -> tuple[int|None, str|None]:
    token = request.cookies.get("access_token")
    try:
        data = jwt.decode(token, JWT_SECRET, JWT_ALGORITHM)
        user_id = data['id']
        expires_in = data['exp'] - time()
        if expires_in < 0:
            return None, None

        new_token = None if expires_in > JWT_REFRESH else generate_auth_token(user_id)
        return user_id, new_token
    except:
        return None, None


def validate_req_auth(request: Request) -> tuple[int | None, int | None]:
    auth_token = request.cookies.get('access_token')
    if auth_token:
        user_id, _ = verify_auth_token(request)

        return (None, 401) if user_id is None  else (user_id, None)
    return None, 401


def authenticate_user(email: str, password: str) -> tuple[dict, str]:
    with Session() as session:
        user = session.query(User).filter(
            User.email == email, User.password == hash_password(password)).first()
        if user is not None:
            return {"success": True, "user_id": user.user_id}, generate_auth_token(user.user_id)
        return {"success": False, "user_id": 0}, ""
