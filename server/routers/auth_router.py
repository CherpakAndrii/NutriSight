from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from utils.auth_utils import authenticate_user, generate_email_verify_token, google_authenticate_user, verify_auth_token, validate_req_auth, can_create_acc, create_acc
from utils.email_utils import send_verification_email
from routers.req_data_types.auth_req_data_types import Credentials, VerifyTokenData, GoogleSignUpData
from routers.res_data_types.auth_res_data_types import LoginResp
from routers.res_data_types.res_data_types import SuccessResponse
from constants import JWT_EXPIRATION

auth_router = APIRouter()

@auth_router.post('/log-in', response_model=LoginResp)
def log_in(credentials: Credentials):
    auth_result, token = authenticate_user(credentials.login, credentials.password)
    response = JSONResponse(content=auth_result)

    if auth_result["success"]:
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=False,  # Use True in production (HTTPS)
            samesite="lax",
            max_age=JWT_EXPIRATION
        )

    return response

@auth_router.post('/google-log-in', response_model=LoginResp)
def google_log_in(credentials: GoogleSignUpData):
    auth_result, token = google_authenticate_user(credentials.id_token)
    response = JSONResponse(content=auth_result)

    if auth_result["success"]:
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=False,  # Use True in production (HTTPS)
            samesite="lax",
            max_age=JWT_EXPIRATION
        )

    return response


@auth_router.post('/sign-up', response_model=SuccessResponse)
def sign_up(credentials: Credentials):
    can_create = can_create_acc(credentials.login)

    if not can_create:
        return {'success': False}

    email_verify_token = generate_email_verify_token(credentials.login, credentials.password)
    send_verification_email(credentials.login, email_verify_token)

    return {'success': True}


# @auth_router.post('/verify', response_model=LoginResp)
# def verify_email(credentials: VerifyTokenData):
#     auth_result, token = create_acc(credentials.access_token)
@auth_router.get('/verify/{token}', response_model=LoginResp)
def verify_email(token: str):
    auth_result, token = create_acc(token)

    response = JSONResponse(content=auth_result)

    if auth_result["success"]:
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=False,  # Use True in production (HTTPS)
            samesite="lax",
            max_age=JWT_EXPIRATION
        )

    return response


@auth_router.post('/verify-token', response_model=LoginResp)
def verify_access_token(request: Request):
    user_id, new_token = verify_auth_token(request)

    response = JSONResponse(content={"success": user_id is not None, "user_id": user_id})

    if user_id and new_token:
        response.set_cookie(
            key="access_token",
            value=new_token,
            httponly=True,
            secure=False,  # Use True in production (HTTPS)
            samesite="lax",
            max_age=JWT_EXPIRATION
        )

    return response


@auth_router.post("/log-out", response_model=SuccessResponse)
def logout():
    response = JSONResponse(content={"success": True})
    response.delete_cookie("access_token")
    return response
