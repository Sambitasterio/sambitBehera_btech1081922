# Task Management Frontend

React frontend application built with Vite, React, and Tailwind CSS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root of the `frontend` folder (copy from `env.example`):
```bash
cp env.example .env
```

3. Fill in your Supabase credentials in the `.env` file:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

## Running the Application

- Development mode:
```bash
npm run dev
```

- Build for production:
```bash
npm run build
```

- Preview production build:
```bash
npm run preview
```

The application will run on `http://localhost:5173` by default (Vite's default port).

## Project Structure

```
frontend/
├── src/
│   ├── config/
│   │   └── supabaseClient.js    # Supabase client initialization
│   ├── services/
│   │   └── api.js                # Axios instance with token interceptor
│   ├── pages/
│   │   ├── Login.jsx             # Login page
│   │   ├── Signup.jsx            # Signup page
│   │   └── Dashboard.jsx         # Protected dashboard page
│   ├── App.jsx                   # Main app component with routes
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Tailwind CSS imports
├── package.json
└── README.md
```

## Features

- **Authentication**: Login and Signup pages using Supabase Auth
- **Protected Routes**: Dashboard is protected and requires authentication
- **API Integration**: Axios configured to automatically attach Supabase access tokens
- **Modern UI**: Beautiful gradient background with glassmorphism effects
- **Responsive Design**: Mobile-friendly interface

## API Configuration

The frontend is configured to call the backend API at `http://localhost:5000/api`. Make sure your backend server is running on port 5000, or update the base URL in `src/services/api.js`.
