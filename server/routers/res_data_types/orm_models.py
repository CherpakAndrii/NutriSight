from typing import Optional, List

from database.enums import AuthProvider, Sex, DietType
from routers.res_data_types.base_model import __BaseModelWithORMConfig, __BaseModelWithConfig


class Intolerance(__BaseModelWithORMConfig):
    intolerance_id: int
    intolerance_name: str


class UserProfile(__BaseModelWithORMConfig):
    user_id: int
    email: str
    auth_provider: AuthProvider
    name: str
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
