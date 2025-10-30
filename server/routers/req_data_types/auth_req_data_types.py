from routers.req_data_types.base_model import __BaseModelWithConfig


class Credentials(__BaseModelWithConfig):
    login: str
    password: str


class GoogleSignUpData(__BaseModelWithConfig):
    id_token: str


class VerifyTokenData(__BaseModelWithConfig):
    access_token: str
