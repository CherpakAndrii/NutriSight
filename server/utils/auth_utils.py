from hashlib import shake_256
from time import time

import jwt
from fastapi import Request, HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests

from constants import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION, JWT_REFRESH, VERIFY_EXPIRATION, GOOGLE_CLIENT_ID
from database.mysql_connector import Session
from database.models import User
from database.enums import AuthProvider


def hash_password(password: str) -> str:
    return shake_256(password.encode('utf-8')).hexdigest(10)


def generate_auth_token(user_id: int, expires_in: int = JWT_EXPIRATION) -> str:
    return jwt.encode(
            {'id': user_id, "exp": time() + expires_in},
            JWT_SECRET, algorithm=JWT_ALGORITHM)


def generate_email_verify_token(login: str, password: str, expires_in: int = VERIFY_EXPIRATION) -> str:
    return jwt.encode(
            {'login': login, 'password': password, 'exp': time() + expires_in},
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


def verify_email_token(verif_token: str) -> tuple[str|None, str|None]:
    try:
        data = jwt.decode(verif_token, JWT_SECRET, JWT_ALGORITHM)
        email = data['login']
        password = data['password']
        expires_in = data['exp'] - time()
        if expires_in < 0:
            return None, None

        return email, password
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
            User.email == email, User.auth_provider != AuthProvider.Google, User.password == hash_password(password)).first()
        if user is not None:
            return {"success": True, "user_id": user.user_id}, generate_auth_token(user.user_id)
        return {"success": False, "user_id": 0}, ""

def google_authenticate_user(id_tkn: str) -> tuple[dict, str]:
    try:
        payload = id_token.verify_oauth2_token(id_tkn, requests.Request(), GOOGLE_CLIENT_ID)
        email = payload["email"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    with Session() as session:
        user = session.query(User).filter(User.email == email).first()
        if user is None:
            user = User(email=email, auth_provider=AuthProvider.Google)
            session.add(user)
            session.commit()
            session.refresh(user)
        elif user.auth_provider == AuthProvider.Local:
            user.auth_provider = AuthProvider.Both
            session.commit()
            session.refresh(user)

        return {"success": True, "user_id": user.user_id}, generate_auth_token(user.user_id)

def can_create_acc(login: str) -> bool:
    with Session() as session:
        user = session.query(User).filter(User.email == login).first()

    return not user


def create_acc(verif_token: str) -> tuple[dict, str]:
    email, password = verify_email_token(verif_token)

    with Session() as session:
        user = session.query(User).filter(User.email == email).first()

    if user:

        return {"success": False, "user_id": None}, ""

    user = User(email=email, auth_provider=AuthProvider.Local, password=hash_password(password))

    with Session() as session:
        session.add(user)
        session.commit()
        session.refresh(user)

    return {"success": True, "user_id": user.user_id}, generate_auth_token(user.user_id)
