from typing import List, Optional

from routers.res_data_types.base_model import __BaseModelWithConfig
from routers.res_data_types.orm_models import UserMeal, ProductTemplate


class GetFoodLogResp(__BaseModelWithConfig):
    food_log: List[UserMeal]


class UpdateFoodLogResp(__BaseModelWithConfig):
    success: bool
    food_log: List[UserMeal]


class TemplateSearchResp(__BaseModelWithConfig):
    results: List[ProductTemplate]

