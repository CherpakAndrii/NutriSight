from typing import Optional

from routers.req_data_types.base_model import __BaseModelWithConfig
from database.enums import MealTime, SourceType


class AddIngredientData(__BaseModelWithConfig):
    name: str
    source_type: SourceType
    portion_grams: int
