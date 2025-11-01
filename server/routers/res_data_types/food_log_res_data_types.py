from typing import List, Optional

from routers.res_data_types.base_model import __BaseModelWithConfig
from routers.res_data_types.orm_models import UserMeal, ProductTemplate


class GetFoodLogResp(__BaseModelWithConfig):
    food_log: List[UserMeal]


class UpdateFoodLogResp(__BaseModelWithConfig):
    success: bool
    food_log: List[UserMeal]


class AISuggestionResp(__BaseModelWithConfig):
    name: str
    default_calories: Optional[float] = None
    default_proteins: Optional[float] = None
    default_fats: Optional[float] = None
    default_carbs: Optional[float] = None
    default_portion_grams: Optional[float] = None


class TemplateSearchResp(__BaseModelWithConfig):
    results: List[ProductTemplate]


class StatisticsEntry(__BaseModelWithConfig):
    calories: float
    proteins: float
    fats: float
    carbs: float


class StatisticsResp(__BaseModelWithConfig):
    today: StatisticsEntry
    average_last_7_days: StatisticsEntry
