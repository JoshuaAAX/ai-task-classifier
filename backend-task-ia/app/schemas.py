from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: str | None = None
    username: str | None = None
    email: EmailStr | None = None

class ChangePassword(BaseModel):
    old_password: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PredictRequest(BaseModel):
    text: str
