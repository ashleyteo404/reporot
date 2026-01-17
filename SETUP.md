# Local Development Setup Guide

This guide will walk you through setting up and running both the backend and frontend applications locally.

## 🚀 Quick Start CLI Commands

Once everything is set up, here are the commands to run both servers:

**Terminal 1 - Backend:**
```powershell
cd reporot-backend
.\.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```
> Note: database is disabled by default (`DB_DISABLED=true`) so the API can start without Postgres. Flip it to `false` in `.env.development` when you want to connect to a real DB.

**Terminal 2 - Frontend:**
```powershell
cd reporot-frontend
pnpm dev
```

**Access:**
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- Frontend: `http://localhost:3000`

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Python 3.13+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** and **npm/pnpm** - [Download Node.js](https://nodejs.org/)
- **PostgreSQL** (Optional) - Only needed if using local PostgreSQL. For fastest MVP setup, use [Supabase](https://supabase.com/) (cloud, free, no installation needed)
- **Docker** (Optional) - Only needed if using Docker Compose for local database
- **Git** - [Download Git](https://git-scm.com/downloads)

## Step 1: Clone the Repository

If you haven't already cloned the repository:

```bash
git clone <repository-url>
cd reporot
```

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd reporot-backend
```

### 2.2 Install Python Dependencies

Create a virtual environment and install dependencies with pip:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install --upgrade pip
.\.venv\Scripts\python -m pip install -e ".[dev]"
```

```bash
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -e ".[dev]"
```

This will:
- Create a virtual environment (`.venv`)
- Install all required Python packages from `pyproject.toml`

### 2.3 Set Up Backend Environment Variables

Create a `.env.development` file in the `reporot-backend` directory:

```bash
# Windows PowerShell
New-Item -Path .env.development -ItemType File

# Or use your text editor to create the file
```

Copy the following template and fill in your values:

```env
# Application Settings
APP_ENV=development
PROJECT_NAME="Reporot Backend"
DEBUG=true

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=reporot_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here-generate-a-random-string
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_DAYS=30

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
DEFAULT_LLM_MODEL=gpt-4o-mini
DEFAULT_LLM_TEMPERATURE=0.7
MAX_TOKENS=4096

# Long-Term Memory Configuration
LONG_TERM_MEMORY_COLLECTION_NAME=agent_memories
LONG_TERM_MEMORY_MODEL=gpt-4o-mini
LONG_TERM_MEMORY_EMBEDDER_MODEL=text-embedding-3-small

# Langfuse Configuration (Optional - for observability)
LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
LANGFUSE_SECRET_KEY=your_langfuse_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_ENABLED=true
```

**Important Notes:**
- Replace `your_postgres_password` with your actual PostgreSQL password
- Generate a secure `JWT_SECRET_KEY` (you can use: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
- Add your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Langfuse keys are optional but recommended for monitoring LLM calls

### 2.4 Set Up PostgreSQL Database with Supabase

1. Go to [Supabase](https://supabase.com/) and sign up (free)
2. Click "New Project"
3. Fill in:
   - **Name**: `reporot-dev` (or any name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
4. Wait ~2 minutes for project to initialize
5. Go to **Project Settings** → **Database**
6. Find the **Connection string** section and copy the **URI** (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
7. Update your `.env.development` with the connection details:

```env
# Extract from Supabase connection string:
# postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres
POSTGRES_HOST=db.xxx.supabase.co
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
```

**✅ That's it!** Tables will be created automatically when you start the server.

### 2.5 Database Tables (Auto-Created!)

**🎉 Good News:** You don't need to run any migrations manually! 

The application automatically creates all required tables when it starts for the first time. The ORM handles this via `SQLModel.metadata.create_all()`.

### 2.6 Start the Backend Server

**Windows (PowerShell):**

```powershell
# Navigate to backend directory
cd reporot-backend

# Start the server (recommended)
.\.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000

# Alternative: Activate virtual environment first
.venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```

**Linux/Mac:**

```bash
# Navigate to backend directory
cd reporot-backend

# Start the server (recommended)
make dev

# Alternative: Manual start
./.venv/bin/python -m uvicorn app.main:app --reload --port 8000
```

**✅ Backend will be running at:** `http://localhost:8000`

**📚 API Documentation:** `http://localhost:8000/docs` (Swagger UI)

**Verify it's working:**
- Open your browser and go to: `http://localhost:8000/docs` (Swagger UI)
- Or check health endpoint: `http://localhost:8000/health`

## Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory

Open a new terminal window and navigate to the frontend:

```bash
cd reporot-frontend
```

### 3.2 Install Node.js Dependencies

The frontend uses `pnpm` (or `npm`). Install dependencies:

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3.3 Set Up Frontend Environment Variables

Create a `.env.local` file in the `reporot-frontend` directory:

```bash
# Windows PowerShell
Copy-Item sample.env.local .env.local

# Or create manually
New-Item -Path .env.local -ItemType File
```

Edit `.env.local` and fill in your values:

```env
# Authentication
AUTH_SECRET=your-auth-secret-here-generate-a-random-string

# Email Configuration (for NextAuth)
EMAIL_PROVIDER_TOKEN=
EMAIL_SERVER_USER=your_email@example.com
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_FROM=your_email@example.com

# PostgreSQL Database Connection (Use your Supabase credentials)
# Format: postgresql://username:password@host:port/database
# Example from Supabase: postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
PG_DB_CONNECTION_STRING=postgresql://postgres:your_supabase_password@db.xxx.supabase.co:5432/postgres
PG_DB_USER=postgres
PG_DB_PASSWORD=your_supabase_password
PG_DB_NAME=postgres
PG_DB_HOST=db.xxx.supabase.co
PG_DB_PORT=5432
PG_DB_SSL=true
PG_DB_MAX_CONNECTIONS=20
PG_DB_IDLE_TIMEOUT=10000

# OAuth Providers (Optional)
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Analytics (Optional)
NEXT_PUBLIC_MEASUREMENT_ID=your_google_analytics_id

# Notifications (Optional)
NOTIFICATION_WEBHOOK=
```

**Important Notes:**
- Generate `AUTH_SECRET` using: `openssl rand -base64 32` or any random string generator
- Use the same PostgreSQL database credentials as the backend
- OAuth providers are optional - you can leave them as `SAMPLE` if not using OAuth
- The `PG_DB_CONNECTION_STRING` should match your database configuration

### 3.4 Start the Frontend Development Server

**Windows (PowerShell):**

```powershell
# Navigate to frontend directory
cd reporot-frontend

# Start the server (using pnpm - recommended)
pnpm dev

# Or using npm
npm run dev
```

**✅ Frontend will be running at:** `http://localhost:3000`

**Verify it's working:**
- Open your browser and go to: `http://localhost:3000`

## Step 4: Verify Everything is Working

### 4.1 Check Backend

1. **Health Check:**
   ```bash
   curl http://localhost:8000/health
   ```
   Or visit: `http://localhost:8000/health` in your browser

2. **API Documentation:**
   - Visit: `http://localhost:8000/docs` for Swagger UI
   - Visit: `http://localhost:8000/redoc` for ReDoc

### 4.2 Check Frontend

1. Open `http://localhost:3000` in your browser
2. You should see the frontend application

### 4.3 Test Backend-Frontend Connection

1. Ensure both servers are running
2. The frontend should be able to make API calls to `http://localhost:8000`
3. Check browser console for any CORS errors (if you see them, verify `ALLOWED_ORIGINS` in backend `.env.development`)

## Troubleshooting

### Backend Issues

**Problem: Database connection error**
- Verify PostgreSQL is running: `pg_isready` or check service status
- Check database credentials in `.env.development`
- Ensure database exists: `psql -U postgres -l` to list databases

**Problem: Module not found errors**
- Reinstall dependencies: `.venv\Scripts\python -m pip install -e ".[dev]"` (Windows) or `pip install -e ".[dev]"` after activating your venv
- Activate virtual environment: `.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (Mac/Linux)

**Problem: uvloop installation error on Windows**
- This is expected! `uvloop` doesn't support Windows. The application will work fine without it using the default asyncio event loop, and pip will skip installing it on Windows.

**Problem: Port 8000 already in use**
- Change port in Makefile or command: `uvicorn app.main:app --reload --port 8001`
- Update frontend API URL accordingly

### Frontend Issues

**Problem: Cannot connect to database**
- Verify `PG_DB_CONNECTION_STRING` is correct
- Ensure PostgreSQL is running
- Check if database exists and credentials are correct

**Problem: Environment variable errors**
- Ensure `.env.local` file exists in `reporot-frontend` directory
- Restart the dev server after changing environment variables
- Check that all required variables are set (see `src/config/env.ts`)

**Problem: Port 3000 already in use**
- Change port: `pnpm dev -- -p 3001`
- Or kill the process using port 3000

### Common Issues

**CORS Errors:**
- Ensure `ALLOWED_ORIGINS` in backend `.env.development` includes `http://localhost:3000`
- Restart backend server after changing CORS settings

**Authentication Issues:**
- Verify `AUTH_SECRET` is set in frontend `.env.local`
- Ensure `JWT_SECRET_KEY` is set in backend `.env.development`

## Development Workflow

### Running Both Servers

You'll need two terminal windows:

**Terminal 1 - Backend:**
```powershell
cd reporot-backend
.\.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```powershell
cd reporot-frontend
pnpm dev
```

### Making Changes

- **Backend changes:** The server will auto-reload with `--reload` flag
- **Frontend changes:** Next.js has hot module replacement (HMR) enabled by default

### Stopping Servers

- Press `Ctrl+C` in each terminal to stop the servers

## Additional Resources

- **Backend API Documentation:** `http://localhost:8000/docs`
- **Backend README:** `reporot-backend/README.md`
- **Frontend README:** `reporot-frontend/README.md`

## Next Steps

Once everything is running:

1. Explore the API documentation at `http://localhost:8000/docs`
2. Test authentication endpoints
3. Try creating a user account
4. Test the chatbot functionality
5. Check the database to see created records

## Need Help?

If you encounter issues not covered in this guide:

1. Check the individual README files in `reporot-backend` and `reporot-frontend`
2. Review error messages in the terminal output
3. Check database connection and credentials
4. Verify all environment variables are set correctly
