from typing import Optional

from routers.res_data_types.base_model import __BaseModelWithConfig
from routers.res_data_types.orm_models import UserProfile


class GetUserProfileResp(__BaseModelWithConfig):
    profile: UserProfile


class ModifyUserProfileResp(__BaseModelWithConfig):
    success: bool
    message: str
    profile: Optional[UserProfile] = None
