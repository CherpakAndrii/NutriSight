from typing import Optional, List
from datetime import datetime

from database.enums import AuthProvider, SourceType, MealTime, Sex, DietType
from routers.res_data_types.base_model import __BaseModelWithORMConfig, __BaseModelWithConfig


class Intolerance(__BaseModelWithORMConfig):
    intolerance_id: int
    intolerance_name: str


class UserProfile(__BaseModelWithORMConfig):
    user_id: int
    email: str
    auth_provider: AuthProvider
    name: Optional[str]
    age: Optional[int] = None
    sex: Optional[Sex] = Sex.PreferNotToSay
    weight: Optional[int] = None
    height: Optional[int] = None
    goal_calories: Optional[int] = None
    goal_protein: Optional[int] = None
    goal_fat: Optional[int] = None
    goal_carbs: Optional[int] = None
    diet_type: Optional[DietType] = DietType.unrestricted
    intolerances: Optional[List[Intolerance]] = None


class UserMeal(__BaseModelWithORMConfig):
    meal_id: int
    user_id: int
    name: str
    actual_calories: Optional[float] = None
    actual_proteins: Optional[float] = None
    actual_fats: Optional[float] = None
    actual_carbs: Optional[float] = None
    actual_portion_grams: Optional[float] = None
    meal_time: MealTime
    created_at: datetime
    source_type: SourceType

class UserIngredient(__BaseModelWithORMConfig):
    ingredient_id: int
    user_id: int
    name: str
    created_at: datetime
    source_type: SourceType
    quantity_available_grams: int


class ProductTemplate(__BaseModelWithORMConfig):
    product_id: int
    name: str
    default_calories: Optional[float] = None
    default_proteins: Optional[float] = None
    default_fats: Optional[float] = None
    default_carbs: Optional[float] = None
    default_portion_grams: Optional[float] = None
    image_url: Optional[str] = None
