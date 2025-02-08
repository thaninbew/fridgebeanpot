## .env setup
```
GOOGLE_MAPS_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
PPLX_KEY=
OPENAI_KEY=
```

# FastAPI Supabase Authentication Backend

This is a FastAPI backend with Supabase authentication integration.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_ANON_KEY`: Your Supabase project's anon/public key

4. Run the server:
```bash
python run.py
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/signup` - Create a new user account
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```

- `POST /auth/login` - Login with email and password
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```

- `POST /auth/logout` - Logout current user (requires authentication)

- `GET /auth/user` - Get current user information (requires authentication)

### Protected Routes
- `GET /protected` - Example protected route (requires authentication)

## Authentication
Protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer your_jwt_token
``` 