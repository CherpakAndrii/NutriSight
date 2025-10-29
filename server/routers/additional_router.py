import os

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse

from constants import log_dir
from utils.auth_utils import validate_req_auth
from routers.res_data_types.res_data_types import MessageResponse

additional_router = APIRouter()

@additional_router.get('/api/logs/{level}', include_in_schema=True)
async def logs(request: Request, level: str, lines: int, include_older: bool = False):
    user_id, error_code = validate_req_auth(request)
    if user_id is not None:
        filepath = f'{log_dir}/{level}.log'
        levels = {'debug', 'info', 'warning', 'error', 'critical', 'access', 'error_specific'}
        if level in levels and os.path.exists(filepath):
            with open(filepath) as f:
                content = f.readlines()
            if include_older and len(content) < lines:
                for older_file in sorted([fl for fl in os.listdir(log_dir) if fl.startswith(f"{level}.log.")], reverse=True):
                    with open(f'{log_dir}/{older_file}') as f:
                        content = f.readlines() + content
                    if len(content) >= lines:
                        break
            return {"level": level, 'log': content[-lines:]}
        raise HTTPException(404)
    else:
        raise HTTPException(error_code)


@additional_router.get('/api/{cat_num}/{filename}', include_in_schema=False)
async def downloaded(cat_num: int, filename: str):
    filepath = f'cache/{cat_num}/{filename}'
    if os.path.exists(filepath):
        with open(filepath) as f:
            content = f.readlines()
            return content
    raise HTTPException(404)


@additional_router.get('/api/ping', response_model=MessageResponse)
async def ping():
    return {'message': 'pong'}


@additional_router.get("/asset-manifest.json")
async def serve_asset_manifest():
    return FileResponse("frontend/asset-manifest.json")


@additional_router.get("/favicon.ico")
async def serve_favicon():
    return FileResponse("frontend/favicon.ico")


@additional_router.get("/logo192.png")
async def serve_logo192():
    return FileResponse("frontend/logo192.png")


@additional_router.get("/logo512.png")
async def serve_logo512():
    return FileResponse("frontend/logo512.png")


@additional_router.get("/manifest.json")
async def serve_manifest():
    return FileResponse("frontend/manifest.json")


@additional_router.get("/robots.txt")
async def serve_robots():
    return FileResponse("frontend/robots.txt")


@additional_router.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    return FileResponse("frontend/index.html")