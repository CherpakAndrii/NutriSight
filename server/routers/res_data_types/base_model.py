from pydantic import BaseModel

class __BaseModelWithConfig(BaseModel):
    class Config:
        validate_assignment = True
        use_enum_values = True


class __BaseModelWithORMConfig(BaseModel):
    class Config:
        validate_assignment = True
        use_enum_values = True
        from_attributes = True