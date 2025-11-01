from typing import List, Dict

from routers.res_data_types.base_model import __BaseModelWithConfig
from routers.res_data_types.orm_models import UserRecipe


class GetRecipesResp(__BaseModelWithConfig):
    recipes: List[UserRecipe]


class AddRecipeResp(__BaseModelWithConfig):
    success: bool
    recipes: List[UserRecipe]


class GeneratedRecipe(__BaseModelWithConfig):
    recipe_id: int
    user_id: int
    name: str
    ingredients: List[Dict[str, str | float]]  # JSON [{name, amount, unit}]
    instructions: str
    calories: float
    protein: float
    fat: float
    carbs: float


class AISuggestionResp(__BaseModelWithConfig):
    recipes: List[GeneratedRecipe]
