from fastapi import FastAPI, HTTPException, Depends, status, APIRouter, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from geo_features import find_locations, generate_map_embed
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi.responses import HTMLResponse
import json

load_dotenv()

app = FastAPI(title="FridgeBeanPot")

# CORS middleware configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client initialization
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase credentials. Please check your .env file.")

supabase: Client = create_client(supabase_url, supabase_key)

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Pydantic models for request validation
class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        user = supabase.auth.get_user(token)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )

# Health check endpoint
@app.get("/")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

# Authentication endpoints
@app.post("/auth/signup")
async def signup(user: UserCreate):
    try:
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })
        return {
            "message": "Signup successful",
            "user": auth_response.user
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/auth/login")
async def login(user: UserLogin):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return {
            "message": "Login successful",
            "session": auth_response.session,
            "user": auth_response.user
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/auth/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    try:
        supabase.auth.sign_out()
        return {"message": "Logout successful"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/auth/user")
async def get_user(token: str = Depends(oauth2_scheme)):
    try:
        user = supabase.auth.get_user(token)
        return {"user": user.user}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Protected route example
@app.get("/protected")
async def protected_route(user = Depends(get_user)):
    ...

# Initialize limiter
limiter = Limiter(key_func=get_remote_address)

@app.get("/api/get-restaurants")
@limiter.limit("5/minute")  # 5 requests per minute
def get_restaurants(request: Request, location: str):
    return find_locations(location)

# @app.get("/api/get-map-embed", response_class=HTMLResponse)
# # @limiter.limit("5/minute")  # 5 requests per minute
# async def get_map_embed(places: str):
#     return "<iframe src=\"" + generate_map_embed(json.loads(places)) + "\"></iframe>"

@app.get("/")
async def root():
    return {"message": "Server is running!"}

app = app  # Required for Vercel 