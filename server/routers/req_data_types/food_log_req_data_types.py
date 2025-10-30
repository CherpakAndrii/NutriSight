from typing import Optional

from routers.req_data_types.base_model import __BaseModelWithConfig
from database.enums import MealTime, SourceType


class UpdateFoodLogData(__BaseModelWithConfig):
    actual_calories: Optional[float] = None
    actual_proteins: Optional[float] = None
    actual_fats: Optional[float] = None
    actual_carbs: Optional[float] = None
    actual_portion_grams: Optional[float] = None
    meal_time: Optional[MealTime] = None


class NewFoodLogData(UpdateFoodLogData):
    name: str
    source_type: SourceType


class ProductTemplateSearchData(__BaseModelWithConfig):
    query: str
