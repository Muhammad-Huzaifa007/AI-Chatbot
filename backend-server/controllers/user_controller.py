from fastapi import APIRouter, HTTPException, status
from helpers.token import generate_token
from models.user import User
from pydantic import BaseModel, Field
import bcrypt
from tortoise.exceptions import IntegrityError
from jose import jwt
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from models.user import User
from tortoise.exceptions import IntegrityError
import bcrypt



router = APIRouter()

# JWT config
SECRET_KEY = "your-secret-key"  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# ######################################  Register ########################################
class SignupPayload(BaseModel):
    user_name: str = Field(min_length=2, max_length=255)
    email: str = Field(min_length=2, max_length=255)
    password: str = Field(min_length=2, max_length=255)

    async def check_unique(self):
        # Checking if the username already exists in the database
        user = await User.filter(user_name=self.user_name).first()
        if user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )

        # Checking if the email already exists in the database
        email = await User.filter(email=self.email).first()
        if email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

    def hash_password(self):
        # Hashing the password before storing it
        hashed_password = bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt())
        return hashed_password.decode('utf-8')


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(data: SignupPayload):
    # Check if username or email are unique
    await data.check_unique()

    # Hash the password before saving
    hashed_password = data.hash_password()

    try:
        # Create a new user in the database
        await User.create(user_name=data.user_name, email=data.email, password=hashed_password)
        return {
            "success": True,
            "message": "Signed up successfully."
        }
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error occurred while creating the user."
        )


# ######################################  Login ########################################
class LoginPayload(BaseModel):
    email: str = Field(min_length=2, max_length=255)
    password: str = Field(min_length=2, max_length=255)

@router.post("/login")
async def login(data: LoginPayload):
    user = await User.filter(email=data.email).first()

    if not user or not bcrypt.checkpw(data.password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password"
        )

    access_token = generate_token({"id": user.id})
    # print("tokern", access_token)
    return {
        "success": True,
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }
