# Zipway URL Shortener

## 🚀 Features

- Clean, responsive user interface
- URL shortening with copy-to-clipboard functionality
- Error handling and user feedback
- Tabs for URL shortening and information
- Modern design using Tailwind CSS and shadcn/ui components
- Middleware for handling short URL redirects through the same domain

## 🔧 Technology Stack

- [Next.js](https://nextjs.org/) - React framework for building full-stack web applications
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development
- [shadcn/ui](https://ui.shadcn.com/) - A collection of reusable UI components for React
- [Prisma](https://www.prisma.io/) - A next-generation ORM for Node.js and TypeScript
- [Zod](https://zod.dev/) - A TypeScript-first schema declaration and validation library
- [React Hook Form](https://react-hook-form.com/) - A library for building performant and flexible forms in React
- [Supabase](https://supabase.io/) - An open-source Firebase alternative for building secure and scalable backends
- [Upstash](https://upstash.com/) - A serverless data platform for Redis and Kafka
- [Resend](https://resend.com/) - An email API for developers
- [Recharts](https://recharts.org/) - A composable charting library built on React components
- [Lucide React](https://lucide.dev/) - A library of simply designed, beautiful icons
- [Better Auth](https://better-auth.dev/) - A simple, secure, and flexible authentication library
- [Jest](https://jestjs.io/) - A delightful JavaScript testing framework with a focus on simplicity
- [React Testing Library](https://testing-library.com/) - A library for testing React components in a user-centric way

## 📁 Project Structure

```
zipway/
├── prisma/                   # Prisma Schema and migrations
├── public/                   # Static files
├── src/                      # Source code
│   ├── __tests__/            # Jest/React Testing Library tests
│   ├── actions/              # Server-side actions
│   ├── app/                  # Next.js app directory with routes
│   │   ├── api/              # API routes
│   │   ├── admin/            # Admin dashboard
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # User dashboard
│   │   ├── [shortId]/        # Dynamic route for URL redirection
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── ui/               # UI components from shadcn/ui
│   │   ├── auth/             # Authentication related components
│   │   ├── dashboard/        # Dashboard components
│   │   └── ...               # Other component directories
│   ├── generated/            # Generated files (from Prisma)
│   ├── lib/                  # Utility functions
│   ├── utils/                # General utility scripts
│   ├── validation/           # Zod schemas for validation
│   └── middleware.ts         # URL redirection logic
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

```bash
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_ADSENSE_CLIENT_ID=


ADMIN_API_TOKEN=

NEXT_PUBLIC_URL=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=


DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

GITHUB_CLIENT_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_SECRET=


ADMIN_EMAILS=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_SUPABASE_URL=

SUPABASE_SERVICE_ROLE_KEY=

RESEND_API_KEY=
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

- The URL shortener backend is implemented as Next.js API Routes.

- This provides a self-contained API with no external rewrites or proxies required.

- The frontend interacts with these API routes directly via HTTP requests and server functions.

### Main Components

- **Dashboard**: The main user interface for creating and managing shortened URLs.
- **UI Components**: Reusable components like Button, Input, Card, etc., from shadcn/ui.
- **Authentication**: Components for user sign-up, login, and session management.

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

## 🚧 Future Improvements

- Implement **Cypress** for end-to-end testing
- Add internationalization (next-intl) support
- Add caching in components and api routes
