from typing import Annotated
from fastapi import FastAPI, Depends
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from helpers.lifespan import lifespan
from controllers import user_controller, prompt_controller
from helpers.get_current_user import get_current_user
from models.user import User

# Loading environment variables
load_dotenv()

# Origins for CORS 
origins = [
    "http://localhost:5173",  # Frontend URL
]

# Initialize FastAPI app
app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # your React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow POST, GET, OPTIONS, etc.
    allow_headers=["*"],  # Allow all headers, including Content-Type and Authorization
)

# Include routers for user and prompt functionality
app.include_router(user_controller.router, prefix="/api", tags=["User"])
app.include_router(prompt_controller.router, prefix="/api", tags=["Conversation and Prompt"])
# app.include_router(prompt_controller.router, prefix="/api", tags=["Conversation"])

