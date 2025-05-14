

import os
import jwt

def generate_token(payload: dict):
    jwt_kwy = os.getenv("SECRET_KEY")
    token = jwt.encode(payload , jwt_kwy , algorithm='HS256')
    return token

def decode_token(token: str):
    # print("p[[[[]]]]" , token)
    jwt_kwy = os.getenv("SECRET_KEY")
    return jwt.decode(token , jwt_kwy , algorithms=['HS256'])