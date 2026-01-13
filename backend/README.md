# Task Management Backend API

Express.js backend server for the Task Management System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root of the `backend` folder (copy from `env.example`):
```bash
cp env.example .env
```

3. Fill in your Supabase credentials in the `.env` file:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

## Running the Server

- Development mode (with auto-reload):
```bash
npm run dev
```

- Production mode:
```bash
npm start
```

The server will run on `http://localhost:3000` by default (or the port specified in your `.env` file).

## API Endpoints

- `GET /` - Test endpoint that returns "API is running"

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabaseClient.js    # Supabase client initialization
│   ├── middleware/
│   │   └── authMiddleware.js    # Bearer token authentication middleware
│   └── server.js                # Express server setup
├── package.json
└── README.md
```
