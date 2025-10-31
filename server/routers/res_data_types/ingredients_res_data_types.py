from typing import List, Optional

from routers.res_data_types.base_model import __BaseModelWithConfig
from routers.res_data_types.orm_models import UserIngredient


class GetIngredientsResp(__BaseModelWithConfig):
    ingredients: List[UserIngredient]


class AddIngredientResp(__BaseModelWithConfig):
    success: bool
    ingredients: List[UserIngredient]


class AISuggestionResp(__BaseModelWithConfig):
    name: str
    portion_grams: Optional[float] = None


