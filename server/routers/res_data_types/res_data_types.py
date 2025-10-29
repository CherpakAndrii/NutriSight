from routers.res_data_types.base_model import __BaseModelWithConfig
from routers.res_data_types.admin_res_data_types import GetUsersResp, UpdateUserResp
from routers.res_data_types.auth_res_data_types import LoginResp, SignUpResp, VerifyTokenResp
from routers.res_data_types.healthcheck_res_data_types import GetManufacturersResp, ManufacturersHealthCheckResp
from routers.res_data_types.user_res_data_types import (GetCategoriesResp, CreateCategoryResp,
                                                               PerformStepForCategoryResp, GetCategoryPhrasesResp, PVRResp,
                                                               GetCategoryAttributesResp, TestPhraseResp, CompareDataframesResp)


class MessageResponse(__BaseModelWithConfig):
    message: str


class SuccessResponse(__BaseModelWithConfig):
    success: bool
