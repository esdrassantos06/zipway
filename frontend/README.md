# Zipway URL Shortener - Frontend

This is the frontend application for the Zipway URL shortener, built with Next.js, React, and Tailwind CSS.

## 🚀 Features

- Clean, responsive user interface
- URL shortening with copy-to-clipboard functionality
- Error handling and user feedback
- Tabs for URL shortening and information
- Modern design using Tailwind CSS and shadcn/ui components

## 🔧 Technology Stack

- [Next.js](https://nextjs.org/) - React framework with server-side rendering
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Reusable UI components
- [Axios](https://axios-http.com/) - HTTP client
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications

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
│   └── services/             # API services (add this directory)
├── .env                      # Environment variables (create this)
├── .gitignore                # Git ignore file
├── Dockerfile                # Docker container definition
├── next.config.ts            # Next.js configuration
├── package.json              # Node.js dependencies
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.js        # Tailwind configuration (add this file)
└── tsconfig.json             # TypeScript configuration
```

## 🛠️ Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
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
docker run -p 3000:3000 --env-file .env zipway-frontend
```

## 🔍 Component Overview

### Main Components

- **ShortenUrlForm**: Handles URL input, submission, and displays the shortened URL
- **UI Components**: Reusable components like Button, Input, Card, etc.


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

Currently, there are no automated tests. This is an area for improvement.

Suggested test tools:
- [Jest](https://jestjs.io/) for unit testing
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for component testing
- [Cypress](https://www.cypress.io/) for end-to-end testing

## 🚧 Future Improvements

-  Add state management (Context API or Redux) for more complex state
- Implement user authentication for personalized shortened URLs
- Add analytics dashboard for registered users
- Implement dark mode toggle
- Add internationalization (i18n) support