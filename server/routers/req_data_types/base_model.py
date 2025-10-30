from pydantic import BaseModel

class __BaseModelWithConfig(BaseModel):
    class Config:
        validate_assignment = True