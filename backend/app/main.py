from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import shortuuid
import os
from dotenv import load_dotenv
import validators

from .models import URLBase, URLInfo
from .database import (
    createTable,
    insert_url,
    get_url_by_id,
    increment_clicks,
    check_id_exists,
    get_url_stats,
    delete_url
)
from .auth import validate_admin_token
from .limiter import limiter, _rate_limit_exceeded_handler, RateLimitExceeded, DEFAULT_LIMITS
load_dotenv()

PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")
ENV = os.getenv("ENV", "development")  # development, staging, production

@asynccontextmanager
async def lifespan(app: FastAPI):
    createTable()
    yield

app = FastAPI(title="Zipway - Url Shortener", description="A simple and efficient URL shortening service", version="1.0.0", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

allow_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

if ENV != "production":
    allow_origins.append("http://localhost:3000")
    allow_origins.append("http://frontend:3000")
    
app.add_middleware(
    CORSMiddleware,
    allow_origins= allow_origins,
    allow_methods=["GET", "POST", "PUT", "DELETE"], 
    allow_headers=["*"],
    allow_credentials=True
)

@app.get("/", tags=["Information"])
async def root(): 
    return {
        "app": "URL Shortener",
        "version": "1.0.0",
        "endpoints": {
            "POST /shorten": "Create a Short URL",
            "GET /{short_id}": "Redirect to the original URL",
            "GET /stats": "Get use stats"
        }
    }
    
@app.get("/ping", tags=["Health"])
@app.head("/ping", tags=["Health"])
async def ping():
    return {"status": "ok"}
    
@app.post("/shorten", response_model=URLInfo, tags=["URLs"])
@limiter.limit(DEFAULT_LIMITS["shorten"])
async def create_short_url(url: URLBase, request: Request):
    if not validators.url(url.target_url):
        raise HTTPException(status_code=400, detail="Invalid URL format. Please provide a valid URL.")
        
    reserved_paths= ["", "shorten", "stats", "docs", "ping"]
    
    
    if url.custom_id:
        short_id = url.custom_id
        
        if short_id in reserved_paths:
            raise HTTPException(status_code=400, detail="This custom ID is reserved for system use. Please choose another one.")
        
        if check_id_exists(short_id):
            raise HTTPException(status_code=400, detail="Custom ID already exists")

    else: 
        while True:
            short_id = shortuuid.uuid()[:7]
            if not check_id_exists(short_id):
                break
    
    success = insert_url(short_id, url.target_url)
    if not success:
        raise HTTPException(status_code=500, detail="Error saving URL")
    
    base_url = os.getenv("BASE_URL")
    short_url = f"{base_url}/{short_id}"
    
    return URLInfo(id=short_id, target_url=url.target_url, short_url=short_url)
    


@app.get("/stats", tags=["Statistics"])
@limiter.limit(DEFAULT_LIMITS["admin"])
async def get_statistics(request: Request, limit: int= 10, token: str = Depends(validate_admin_token)):
    stats = get_url_stats(limit)
    return {
        "top_urls": stats,
        "total": len(stats)
    }

    
@app.get("/{short_id}", tags=["URLs"])
@limiter.limit(DEFAULT_LIMITS["redirect"])
async def redirect_to_target(short_id: str, request: Request):
    
    url_data = get_url_by_id(short_id)
    
    if not url_data:
        raise HTTPException(status_code=404, detail="URL not found")
    
    increment_clicks(short_id)
    
    return RedirectResponse(url=url_data["target_url"])

@app.delete("/delete_url", tags=["URLs"])
@limiter.limit(DEFAULT_LIMITS["admin"])
async def delete_short_url(short_id: str, request: Request, token: str = Depends(validate_admin_token)):
    
    url_data = get_url_by_id(short_id)
    
    if not url_data:
        raise HTTPException(status_code=404, detail="URL not found")
    
    success = delete_url(short_id)
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete URL")
    
    return {"detail": "URL deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)