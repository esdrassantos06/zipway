# Zipway URL Shortener

Zipway is a modern, efficient URL shortening service that allows users to create compact links that redirect to original URLs. This project consists of a FastAPI backend and a Next.js frontend.

## 🚀 Features

- Create shortened URLs from long URLs
- Optional custom URL slugs
- Click tracking and analytics
- Rate limiting to prevent abuse
- Responsive, modern UI
- Single domain experience with middleware redirection

## 🏗️ Architecture

The application is split into two main components:

- **Backend**: FastAPI-based REST API with SQLite database (deployed on Render)
- **Frontend**: Next.js application with React and Tailwind CSS (deployed on Vercel)

The Next.js middleware enables all shortened URLs to be accessed directly from the main domain.

## 🔧 Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose (for local development)
- [Node.js](https://nodejs.org/) (v18+) for frontend development
- [Python](https://www.python.org/) (v3.9+) for backend development
- [Vercel](https://vercel.com/) account for frontend deployment
- [Render](https://render.com/) account for backend deployment
- [Uptime BetterStack](https://uptime.betterstack.com/) for keeping the backend alive

## 🛠️ Getting Started

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/esdrassantos06/zipway.git
   cd zipway
   ```

2. Create environment variables:

   For backend (create `backend/.env`):
   ```
   ADMIN_API_TOKEN=your_secure_admin_token
   HOST=0.0.0.0
   PORT=8000
   BASE_URL=yoursiteurl.com
   ```

   For frontend (create `frontend/.env`):
   ```
   NEXT_PUBLIC_API_URL=/backend
   API_BASE_URL=http://localhost:8000 or your api Link
   ```

### Running with Docker Compose (Development)

```bash
docker-compose up
```

This will start both the backend and frontend services. The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Deployment Setup

#### Backend (Render)
1. Push your code to a Git repository
2. Create a new Web Service on Render connected to your repository
3. Set the build command to `pip install -r requirements.txt`
4. Set the start command to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add the environment variables from the `.env` file
6. Deploy the service

#### Frontend (Vercel)
1. Push your code to a Git repository
2. Import the project into Vercel
3. Set the environment variables
4. Deploy the project
5. Configure your custom domain (zipway-shortener.me)

#### Keep Backend Alive
1. Create an account on UptimeRobot
2. Add a new HTTP(s) monitor
3. Set the URL to your backend ping endpoint (https://your-backend.onrender.com/ping)
4. Set the monitoring interval to 5 minutes

## 📁 Project Structure

```
zipway/
├── backend/                # FastAPI backend
│   ├── app/                # Application code
│   ├── Dockerfile          # Backend container definition
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── src/                # Source code
│   │   ├── middleware.ts   # URL redirection logic
│   ├── Dockerfile          # Frontend container definition
│   └── package.json        # Node.js dependencies
└── docker-compose.yml      # Service orchestration
```

## 🔍 Documentation

- Backend API documentation is available at https://your-backend.onrender.com/docs when the service is running
- More detailed documentation for each component is available in their respective directories

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.