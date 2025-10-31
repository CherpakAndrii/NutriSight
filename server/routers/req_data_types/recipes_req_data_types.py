from typing import List, Dict

from routers.req_data_types.base_model import __BaseModelWithConfig


class AddRecipeData(__BaseModelWithConfig):
    name: str
    ingredients: List[Dict[str, str|float]]     # JSON [{name, amount, unit}]
    instructions: str
    calories: float
    protein: float
    fat: float
    carbs: float
