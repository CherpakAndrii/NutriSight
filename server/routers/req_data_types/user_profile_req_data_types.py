from typing import Optional, List

from routers.req_data_types.base_model import __BaseModelWithConfig
from database.enums import Sex, DietType


class ChangeAgeData(__BaseModelWithConfig):
    age: int

class ChangeNumericFieldData(__BaseModelWithConfig):
    value: float


class ChangeNameData(__BaseModelWithConfig):
    name: str

class ChangePasswordData(__BaseModelWithConfig):
    prev_pwd: Optional[str] = None
    new_pwd: str


class ChangeSexData(__BaseModelWithConfig):
    sex: Sex


class ChangeDietTypeData(__BaseModelWithConfig):
    dietType: DietType


