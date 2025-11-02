from typing import List, Dict

from routers.res_data_types.base_model import __BaseModelWithConfig
from routers.res_data_types.orm_models import UserRecipe


class GetRecipesResp(__BaseModelWithConfig):
    recipes: List[UserRecipe]


class AddRecipeResp(__BaseModelWithConfig):
    success: bool
    recipes: List[UserRecipe]

