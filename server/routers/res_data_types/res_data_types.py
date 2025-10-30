from routers.res_data_types.base_model import __BaseModelWithConfig
from routers.res_data_types.auth_res_data_types import LoginResp
from routers.res_data_types.user_profile_res_data_types import ModifyUserProfileResp, GetUserProfileResp


class MessageResponse(__BaseModelWithConfig):
    message: str


class SuccessResponse(__BaseModelWithConfig):
    success: bool
