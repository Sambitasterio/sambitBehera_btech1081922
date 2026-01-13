# Task Management System

A full-stack task management application built with React, Express.js, and Supabase. Features a modern Kanban board interface for organizing tasks with drag-and-drop functionality, user authentication, and profile management.

🌐 **Live Application**: [View Live Demo](https://sambitbehera-btech1081922-1.onrender.com)

## 🚀 Features

- **User Authentication**: Secure login and signup using Supabase Auth
- **Kanban Board**: Interactive drag-and-drop task board with three columns (Pending, In Progress, Completed)
- **Task Management**: Create, read, update, and delete tasks
- **User-Specific Tasks**: Each user can only access their own tasks (Row Level Security)
- **Profile Management**: Edit profile details and delete account
- **Status Filtering**: Filter tasks by status (All, Pending, In Progress, Completed)
- **Real-time Updates**: Optimistic UI updates with automatic sync to backend
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with glassmorphism effects

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **@hello-pangea/dnd** - Drag and drop library
- **@supabase/supabase-js** - Supabase client library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Supabase** - Backend as a Service (Database, Auth, RLS)
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Database
- **PostgreSQL** (via Supabase) - Relational database
- **Row Level Security (RLS)** - Data isolation per user

## 📁 Project Structure

```
task management/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── AddTaskModal.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Profile.jsx
│   │   ├── config/          # Configuration files
│   │   │   └── supabaseClient.js
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   └── App.jsx          # Main app component
│   ├── package.json
│   └── .env                 # Environment variables (create from env.example)
│
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   │   ├── taskController.js
│   │   │   └── profileController.js
│   │   ├── middleware/      # Express middleware
│   │   │   └── authMiddleware.js
│   │   ├── config/          # Configuration files
│   │   │   └── supabaseClient.js
│   │   └── server.js        # Express server
│   ├── package.json
│   └── .env                 # Environment variables (create from env.example)
│
├── supabase_schema.sql      # Database schema for Supabase
├── README.md                # This file
└── .gitignore               # Git ignore rules
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** 18+ (20+ recommended)
- **npm** or **yarn**
- **Supabase Account** - [Sign up for free](https://supabase.com)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API** and copy:
   - Project URL
   - Anon public key
   - Service role key (optional, for account deletion)
3. Go to **SQL Editor** and run the SQL from `supabase_schema.sql`

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp env.example .env

# Edit .env and add your Supabase credentials
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional)
# PORT=3000
# NODE_ENV=development
```

**Backend Environment Variables** (`.env`):
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Optional: for account deletion
PORT=3000
NODE_ENV=development
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp env.example .env

# Edit .env and add your Supabase credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your_anon_key
# VITE_API_URL=https://sambitbehera-btech1081922.onrender.com/api (production)
# or VITE_API_URL=http://localhost:3000/api (local development)
```

**Frontend Environment Variables** (`.env`):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# Production backend URL
VITE_API_URL=https://sambitbehera-btech1081922.onrender.com/api
# Or for local development:
# VITE_API_URL=http://localhost:3000/api
```

### 5. Start the Development Servers

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:3000` (or the port specified in `.env`).

#### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite default port).

### 6. Access the Application

**Production URLs:**
- **Frontend**: https://sambitbehera-btech1081922-1.onrender.com
- **Backend API**: https://sambitbehera-btech1081922.onrender.com
- **API Test**: https://sambitbehera-btech1081922.onrender.com/ (returns "API is running")

**Local Development:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Test**: http://localhost:3000/ (returns "API is running")

## 📚 API Endpoints

### Authentication
All endpoints (except `/`) require authentication via Bearer token in the Authorization header.

### Tasks

- `POST /api/tasks` - Create a new task
  - Body: `{ title, description, status, due_date }`
  
- `GET /api/tasks` - Get all tasks for the logged-in user
  - Query: `?status=pending` (optional filter)
  
- `PUT /api/tasks/:id` - Update a task
  - Body: `{ title?, description?, status?, due_date? }`
  
- `DELETE /api/tasks/:id` - Delete a task

### Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
  - Body: `{ email?, metadata? }`
- `DELETE /api/profile` - Delete user account and all associated data

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level security ensuring users can only access their own tasks
- **JWT Authentication**: Secure token-based authentication via Supabase
- **CORS Protection**: Configured CORS for allowed origins
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## 🎨 Features in Detail

### Kanban Board
- Drag and drop tasks between columns
- Real-time status updates
- Optimistic UI updates
- Automatic backend synchronization
- Visual feedback during drag operations

### Task Management
- Create tasks with title, description, status, and due date
- Filter tasks by status using dropdown filter
- Mark tasks as overdue (visual indicators)
- Edit task details
- Delete tasks with confirmation
- Drag and drop tasks between status columns

### Profile Management
- View account information
- Update email and profile metadata
- Delete account (with optional automatic deletion via service role key)

## 🚀 Deployment

This application is deployed on **Render**:

- **Frontend**: Deployed as a static site on Render
- **Backend**: Deployed as a web service on Render

### Production URLs
- **Frontend**: https://sambitbehera-btech1081922-1.onrender.com
- **Backend API**: https://sambitbehera-btech1081922.onrender.com

### Deployment Configuration

#### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Create a new **Web Service**
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional)
   - `PORT` (Render will set this automatically)
   - `NODE_ENV=production`

#### Frontend Deployment (Render)
1. Create a new **Static Site**
2. Connect your GitHub repository
3. Set build command: `cd frontend && npm install && npm run build`
4. Set publish directory: `frontend/dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (your backend URL)

### CORS Configuration
The backend is configured to accept requests from:
- Production frontend: `https://sambitbehera-btech1081922-1.onrender.com`
- Local development: `http://localhost:5173`, `http://localhost:3000`, `http://localhost:5000`

## 🧪 Development

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload (nodemon)

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 Environment Variables Reference

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin operations | No |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `VITE_API_URL` | Backend API URL (default: https://sambitbehera-btech1081922.onrender.com/api) | No |

## 🐛 Troubleshooting

### Backend won't start
- Check that `.env` file exists in `backend/` folder
- Verify Supabase credentials are correct
- Ensure port 3000 is not in use

### Frontend can't connect to backend
- **Local Development**: Verify backend is running on port 3000
- **Production**: Check `VITE_API_URL` in frontend `.env` or verify it's set in Render environment variables
- Check browser console for CORS errors
- Verify backend URL is correct (should be `https://sambitbehera-btech1081922.onrender.com/api` for production)

### Tasks not loading
- Verify Supabase table `tasks` exists (run `supabase_schema.sql`)
- Check Row Level Security policies are enabled
- Verify user is authenticated

### Authentication errors
- Check Supabase credentials in both frontend and backend `.env` (or Render environment variables)
- Verify Supabase project is active
- Check browser console for token errors
- Ensure CORS is properly configured on backend for your frontend URL

### Production deployment issues
- Verify all environment variables are set in Render dashboard
- Check Render logs for build or runtime errors
- Ensure backend service is running (check Render dashboard status)
- Verify frontend build completed successfully
- Check that `VITE_API_URL` points to the correct backend URL in production

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using React, Express.js, and Supabase**
