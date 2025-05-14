from fastapi import Depends, HTTPException, status 
from jose import jwt, JWTError
from typing import Annotated
from datetime import datetime
from helpers.token import decode_token
from models.user import User
from controllers.user_controller import login
from fastapi.security import HTTPAuthorizationCredentials , HTTPBearer
SECRET_KEY = "supersecretkey123"
ALGORITHM = "HS256"
security = HTTPBearer()


async def get_current_user(token : Annotated[HTTPAuthorizationCredentials, Depends(security)]):
    try:
        # print("token", token.credentials)
        # print("----------")
        token = token.credentials
        payload = decode_token(token)
        # print("1")
        if payload:

           user_id = payload.get("id")
        # print("2")
        if not user_id:
            raise HTTPException(
                status_code= status.HTTP_401_UNAUTHORIZED,
                detail= "Invalid Token payload"
            )
        # print("3")
        user = await User.filter(id = user_id).first()
        if not user:
            raise HTTPException(
                status_code= status.HTTP_401_UNAUTHORIZED,
                detail= "User not found"
            )
        return user
    except JWTError:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail= "invalid or expired token"
        )
    except Exception as e:
        raise HTTPException(
            status_code= status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = f"Internal server error {e}"
        )