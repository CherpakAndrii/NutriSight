from typing import Optional

from routers.res_data_types.base_model import __BaseModelWithConfig


class LoginResp(__BaseModelWithConfig):
    success: bool
    user_id: int
