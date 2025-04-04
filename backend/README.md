# Zipway URL Shortener - Backend

This is the backend service for the Zipway URL shortener application, built with FastAPI and SQLite.

## 🚀 Features

- Create shortened URLs with automatic or custom slugs
- Redirect users to original URLs
- Track click statistics
- Admin-only statistics endpoint with token authentication
- Rate limiting to prevent abuse
- Health check endpoint for uptime monitoring

## 🔧 Technology Stack

- [FastAPI](https://fastapi.tiangolo.com/) - Fast, modern API framework
- [SQLite](https://www.sqlite.org/) - Lightweight database
- [Uvicorn](https://www.uvicorn.org/) - ASGI server
- [Python-dotenv](https://github.com/theskumar/python-dotenv) - Environment variable management
- [ShortUUID](https://github.com/skorokithakis/shortuuid) - Unique ID generation

## 📁 Project Structure

```
backend/
├── app/                     # Application directory
│   ├── __init__.py          # Package initializer
│   ├── auth.py              # Authentication logic
│   ├── database.py          # Database operations
│   ├── limiter.py           # Rate limiting configuration
│   ├── main.py              # FastAPI application and routes
│   └── models.py            # Pydantic models
├── .env                     # Environment variables (create this)
├── .gitignore               # Git ignore file
├── Dockerfile               # Docker container definition
├── requirements.txt         # Python dependencies
└── shortener.db             # SQLite database (created on startup)
```

## 🛠️ Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
ADMIN_API_TOKEN=your_secure_admin_token
HOST=0.0.0.0
PORT=8000
BASE_URL=https://www.zipway-shortener.me
```

## 🚀 Running Locally

### With Python

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the application:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

### With Docker

```bash
docker build -t zipway-backend .
docker run -p 8000:8000 -v $(pwd)/shortener.db:/app/shortener.db --env-file .env zipway-backend
```

## 📝 API Documentation

Once the server is running, access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Key Endpoints

| Endpoint             | Method | Description                                   | Rate Limit      |
|----------------------|--------|-----------------------------------------------|-----------------|
| `/`                  | GET    | API information                               | 100/minute      |
| `/ping`              | GET    | Health check endpoint                         | (no limit)      |
| `/shorten`           | POST   | Create a shortened URL                        | 20/minute       |
| `/{short_id}`        | GET    | Redirect to the original URL                  | 200/minute      |
| `/stats`             | GET    | Get usage statistics (admin only)             | 10/minute       |

## 🔍 Database Schema

The SQLite database contains a single table:

```sql
CREATE TABLE urls (
    id TEXT PRIMARY KEY,
    target_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    clicks INTEGER DEFAULT 0
)
```

## 🚀 Deployment

### Deploying to Render

1. Push your code to a Git repository
2. Create a new Web Service on Render connected to your repository
3. Set the build command to `pip install -r requirements.txt`
4. Set the start command to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add the environment variables from the `.env` file
6. Deploy the service

### Keeping the Service Active

To prevent Render's free tier from putting your service to sleep:

1. Create an account on UptimeRobot
2. Add a new HTTP(s) monitor
3. Set the URL to your backend ping endpoint (https://your-backend.onrender.com/ping)
4. Set the monitoring interval to 5 minutes

## 🚧 Development

### Adding New Features

1. Create or modify routes in `app/main.py`
2. Update database functions in `app/database.py` if needed
3. Add new models in `app/models.py` if needed

### Security Considerations

- Admin token is required for accessing statistics
- Rate limiting is implemented to prevent abuse
- URL validation is performed before shortening

## 🧪 Testing

Currently, there are no automated tests. This is an area for improvement.

Suggested test tools:
- [pytest](https://docs.pytest.org/) for unit and integration tests
- [pytest-asyncio](https://github.com/pytest-dev/pytest-asyncio) for testing async functions
- [TestClient](https://fastapi.tiangolo.com/tutorial/testing/) from FastAPI for API testing