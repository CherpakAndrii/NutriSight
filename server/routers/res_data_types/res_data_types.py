from routers.res_data_types.base_model import __BaseModelWithConfig


class MessageResponse(__BaseModelWithConfig):
    message: str


class SuccessResponse(__BaseModelWithConfig):
    success: bool
