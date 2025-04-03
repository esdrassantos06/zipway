# Zipway URL Shortener

Zipway is a modern, efficient URL shortening service that allows users to create compact links that redirect to original URLs. This project consists of a FastAPI backend and a Next.js frontend.

## 🚀 Features

- Create shortened URLs from long URLs
- Optional custom URL slugs
- Click tracking and analytics
- Rate limiting to prevent abuse
- Responsive, modern UI

## 🏗️ Architecture

The application is split into two main components:

- **Backend**: FastAPI-based REST API with SQLite database
- **Frontend**: Next.js application with React and Tailwind CSS

Both components are containerized using Docker for easy deployment.

## 🔧 Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (v18+) for frontend development
- [Python](https://www.python.org/) (v3.9+) for backend development

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
   ALLOWED_ORIGINS=http://localhost:3000
   ADMIN_API_TOKEN=your_secure_admin_token
   HOST=0.0.0.0
   PORT=8000
   ```

   For frontend (create `frontend/.env`):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### Running with Docker Compose

```bash
docker-compose up
```

This will start both the backend and frontend services. The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 📁 Project Structure

```
zipway/
├── backend/                # FastAPI backend
│   ├── app/                # Application code
│   ├── Dockerfile          # Backend container definition
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── src/                # Source code
│   ├── Dockerfile          # Frontend container definition
│   └── package.json        # Node.js dependencies
└── docker-compose.yml      # Service orchestration
```

## 🔍 Documentation

- Backend API documentation is available at http://localhost:8000/docs when the service is running
- More detailed documentation for each component is available in their respective directories

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
