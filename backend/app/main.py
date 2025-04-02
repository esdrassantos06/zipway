from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import shortuuid
import os
from dotenv import load_dotenv


from .models import URLBase, URLInfo
from .database import (
    createTable,
    insert_url,
    get_url_by_id,
    increment_clicks,
    check_id_exists,
    get_url_stats
)
from .auth import validate_admin_token
from .limiter import limiter, _rate_limit_exceeded_handler, RateLimitExceeded, DEFAULT_LIMITS
load_dotenv()

PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")


app = FastAPI(title="Zipway - Url Shortener", description= "A simple and efficient URL shortening service", version="1.0.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://zipway-shortener.me"],
    allow_methods=["GET", "POST", "PUT", "DELETE"], 
    allow_headers=["*"],
    allow_credentials=True
)


@app.on_event("startup")
def startup_event():
    createTable()



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
    
@app.post("/shorten", response_model=URLInfo, tags=["URLs"])
@limiter.limit(DEFAULT_LIMITS["shorten"])
async def create_short_url(url: URLBase, request: Request):
    
    if not url.target_url.startswith(("http://", "https://")):
        url.target_url = f"https://{url.target_url}"
    
    if url.custom_id:
        short_id = url.custom_id
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
    
    base_url = str(request.base_url).rstrip("/")
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)