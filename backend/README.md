# TooSale Backend

Node.js backend API for the TooSale e-commerce platform.

## Features

- **Authentication**: JWT-based authentication with secure password hashing
- **PostgreSQL Database**: Full database integration with connection pooling
- **Security**: Helmet.js, CORS, rate limiting, input validation
- **Database Migrations**: Automated database schema management

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

The `.env` file is already configured with your PostgreSQL connection string:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YvXHVEmPaSYubpROmowXqvpuHEYsKmUe@shinkansen.proxy.rlwy.net:26203/railway
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` to a secure random string in production.

### 3. Run Database Migrations

Create the required database tables:

```bash
npm run migrate
```

This will create the `users` table with all necessary columns and indexes.

### 4. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info (requires authentication)

### Health Check

- `GET /api/health` - Server health status

## Frontend Integration

Make sure your frontend is configured to connect to the backend API. The frontend should have this environment variable:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

- **Password Hashing**: Uses bcryptjs with 12 salt rounds
- **JWT Tokens**: 7-day expiration
- **Rate Limiting**: 
  - General API: 100 requests per 15 minutes
  - Auth endpoints: 5 requests per 15 minutes
- **Input Validation**: Comprehensive validation with express-validator
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers protection

## Development

### Adding New Migrations

1. Create a new `.sql` file in the `migrations/` folder
2. Use naming convention: `002_migration_name.sql`
3. Run migrations: `npm run migrate`

### Testing API Endpoints

You can test the API using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"SecurePass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'
```

## Troubleshooting

1. **Database Connection Issues**: Verify the DATABASE_URL in `.env`
2. **Migration Errors**: Check PostgreSQL permissions and connection
3. **CORS Errors**: Ensure frontend origin is configured correctly
4. **JWT Errors**: Verify JWT_SECRET is set and consistent
