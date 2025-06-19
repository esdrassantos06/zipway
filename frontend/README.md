# Zipway URL Shortener - Frontend

This is the frontend application for the Zipway URL shortener, built with Next.js, React, and Tailwind CSS.

## 🚀 Features

- Clean, responsive user interface
- URL shortening with copy-to-clipboard functionality
- Error handling and user feedback
- Tabs for URL shortening and information
- Modern design using Tailwind CSS and shadcn/ui components
- Middleware for handling short URL redirects through the same domain

## 🔧 Technology Stack

- [Next.js](https://nextjs.org/) - React framework with server-side rendering
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Reusable UI components
- [Axios](https://axios-http.com/) - HTTP client
- [Jest](https://jestjs.io/) - Testing Framework
- [React Testing Library](https://testing-library.com/) - Testing Library

## 📁 Project Structure

```
frontend/
├── public/                   # Static files
├── src/                      # Source code
│   ├── app/                  # Next.js app directory
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── ui/               # UI components
│   │   └── shorten-url-form.tsx # Form component
│   ├── lib/                  # Utility functions
│   ├── utils/                # Utilities like API client
│   ├──  middleware.ts        # URL redirection logic
│   └── tests/                # Jest Tests
├── .env                      # Environment variables (create this)
├── .gitignore                # Git ignore file
├── Dockerfile                # Docker container definition
├── next.config.ts            # Next.js configuration
├── package.json              # Node.js dependencies
├── postcss.config.mjs        # PostCSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🛠️ Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
NEXT_PUBLIC_API_URL=/backend
API_BASE_URL=https://your-backendlink.com or http://backend:8000 (Docker) or http://localhost:8000
```

## 🚀 Running Locally

### With Node.js

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

2. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### With Docker

```bash
docker build -t zipway-frontend .
docker run -d --name zipway-frontend-container -p 3000:3000 --env-file .env zipway-frontend
```

When you use docker run, Docker always creates a new container from the specified image (in this case, zipway-frontend). It does not reuse an existing container; instead, it creates a fresh instance of the image every time.

### Why?

- The image is a static blueprint.

- The container is a running instance created from that image.

- Running docker run multiple times will create multiple containers.

To reuse the same container across runs, follow these steps:

1. Create the container once and give it a name using --name.

2. Use docker start and docker stop to manage that named container.

Example of creating and naming the frontend container:

```bash
docker run -d --name zipway-frontend-container -p 3000:3000 --env-file .env zipway-frontend
```

Later, to stop and restart the same container:

```bash
docker stop zipway-frontend-container
docker start zipway-frontend-container
```

## 🔍 Key Components

### URL Shortening

The application uses a combination of Next.js rewrites and middleware to provide a seamless experience:

- API requests are forwarded to the backend using rewrites in `next.config.ts`
- Short URL redirects are handled by the middleware in `middleware.ts`

### Main Components

- **ShortenUrlForm**: Handles URL input, submission, and displays the shortened URL
- **UI Components**: Reusable components like Button, Input, Card, etc.

### Configuring Middleware

The middleware in `src/middleware.ts` is automatically detected and used by Vercel. It intercepts requests to your domain and redirects short URL requests to your backend API.

## 🎨 UI Customization

The project uses Tailwind CSS with custom theme variables. To modify the theme:

1. Adjust color variables in `src/app/globals.css`
2. Use Tailwind utility classes for component styling
3. Modify shadcn/ui components in the `src/components/ui` directory

## 📱 Responsive Design

The UI is responsive by default, using Tailwind's responsive utility classes:

- Mobile-first approach
- Breakpoints for different screen sizes
- Flexible layouts with proper spacing

## 🧪 Testing

The project includes automated tests with:

- **Jest** for unit testing
- **React Testing Library** for component testing

Run tests with:

```bash
npm test
# or
npm run test:watch
```

Planned testing improvements:

- Implement **Cypress** for end-to-end testing

## 🚧 Future Improvements

- Add state management (Context API or Redux) for more complex state
- Implement user authentication for personalized shortened URLs
- Add analytics dashboard for registered users
- Implement dark mode toggle
- Add internationalization (i18n) support
