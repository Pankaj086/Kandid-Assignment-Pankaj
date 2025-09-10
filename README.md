# Kandid - Candidate Management System

A modern Next.js application for managing candidates, built with TypeScript, Drizzle ORM, and Better Auth.

## 🚀 Features

- **Candidate Profile Management** - Complete candidate information tracking
- **Application Tracking** - Monitor application status and progress
- **Interview Scheduling** - Schedule and manage interviews
- **Document Management** - Handle resumes and documents
- **Real-time Notifications** - Stay updated with application changes
- **Role-based Access Control** - Secure access management
- **Google OAuth Authentication** - Seamless authentication via Better Auth
- **Modern UI** - Built with Tailwind CSS and Shadcn/UI components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **Package Manager** - npm, yarn, pnpm, or bun
- **Git** for version control
- **PostgreSQL** database (v12 or higher)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kandid
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-32-character-random-secret
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# PostgreSQL Database
PGUSER=your_postgres_username
PGHOST=localhost
PGDATABASE=kandid
PGPASSWORD=your_postgres_password
PGPORT=5432

# Optional: Development
NODE_ENV=development
```

### 4. Database Setup

```bash
# Generate database client
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Seed with sample data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
The application uses **Better Auth** for authentication with Google OAuth support. All protected routes require valid session.

#### Authentication Flow
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. After approval, redirected back with session
4. Session stored securely with Better Auth

#### Authentication Endpoints
```
GET  /api/auth/[...all]  - Better Auth handler (handles all auth routes)
```

**Better Auth Routes:**
- `/api/auth/sign-in/google` - Initiate Google OAuth
- `/api/auth/callback/google` - OAuth callback
- `/api/auth/session` - Get current session
- `/api/auth/sign-out` - Sign out user

### API Endpoints

#### Candidates
```bash
GET    /api/candidates           # Get all candidates (paginated)
POST   /api/candidates           # Create new candidate
GET    /api/candidates/[id]      # Get candidate by ID
PUT    /api/candidates/[id]      # Update candidate
DELETE /api/candidates/[id]      # Delete candidate
```

#### Applications
```bash
GET    /api/applications         # Get all applications
POST   /api/applications         # Submit new application
GET    /api/applications/[id]    # Get application details
PUT    /api/applications/[id]    # Update application
DELETE /api/applications/[id]    # Delete application
```

#### Interviews
```bash
GET    /api/interviews           # Get interviews
POST   /api/interviews           # Schedule interview
GET    /api/interviews/[id]      # Get interview details
PUT    /api/interviews/[id]      # Update interview
DELETE /api/interviews/[id]      # Cancel interview
```

### Request/Response Examples

#### Create Candidate
```bash
POST /api/candidates
Content-Type: application/json
Authorization: Bearer <session-token>

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0123",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": 3,
  "resumeUrl": "https://example.com/resume.pdf"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": 3,
    "resumeUrl": "https://example.com/resume.pdf",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🗄️ Database Schema

The application uses **Drizzle ORM** with PostgreSQL for robust data management.

### Schema Overview

#### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Sessions Table (Better Auth)
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  expires_at TIMESTAMP NOT NULL,
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  user_agent TEXT,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE
);
```

#### Accounts Table (OAuth)
```sql
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  access_token_expires_at TIMESTAMP,
  refresh_token_expires_at TIMESTAMP,
  scope TEXT,
  password TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Candidates Table
```sql
CREATE TABLE candidates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  skills TEXT[],
  experience INTEGER DEFAULT 0,
  resume_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Applications Table
```sql
CREATE TABLE applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interviewed', 'accepted', 'rejected')),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Interviews Table
```sql
CREATE TABLE interviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id TEXT REFERENCES applications(id) ON DELETE CASCADE,
  interviewer_id TEXT REFERENCES users(id),
  scheduled_at TIMESTAMP NOT NULL,
  duration INTEGER DEFAULT 60,
  location TEXT,
  type TEXT DEFAULT 'technical' CHECK (type IN ('technical', 'behavioral', 'final')),
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Commands

```bash
# Generate Drizzle client
npm run db:generate

# Push schema changes
npm run db:push

# Pull schema from database
npm run db:pull

# Open Drizzle Studio
npm run db:studio

# Run migrations
npm run db:migrate
```

## 🚀 Deployment Instructions

### Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel --prod
   ```

2. **Environment Variables in Vercel**
   ```env
   BETTER_AUTH_SECRET=production-secret-32-chars
   BETTER_AUTH_URL=https://your-domain.vercel.app
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   PGUSER=your-pg-username
   PGHOST=your-pg-host
   PGDATABASE=your-pg-database
   PGPASSWORD=your-pg-password
   PGPORT=5432
   ```

3. **Post-Deployment**
   ```bash
   # Run database migrations on production
   npx drizzle-kit push:pg --config=drizzle.config.ts
   ```

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   # Build image
   docker build -t kandid .
   
   # Run container
   docker run -p 3000:3000 \
     -e BETTER_AUTH_SECRET="your-secret" \
     -e BETTER_AUTH_URL="http://localhost:3000" \
     -e GOOGLE_CLIENT_ID="your-client-id" \
     -e GOOGLE_CLIENT_SECRET="your-client-secret" \
     -e PGUSER="postgres" \
     -e PGHOST="host.docker.internal" \
     -e PGDATABASE="kandid" \
     -e PGPASSWORD="password" \
     -e PGPORT="5432" \
     kandid
   ```

### Production Server Setup

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Process Manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "kandid" -- start
   pm2 startup
   pm2 save
   ```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run e2e tests (if configured)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📁 Project Structure

```
kandid/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Better Auth routes
│   │   │   ├── candidates/    # Candidate API
│   │   │   ├── applications/  # Application API
│   │   │   └── interviews/    # Interview API
│   │   ├── candidates/        # Candidate pages
│   │   ├── applications/      # Application pages
│   │   ├── interviews/        # Interview pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Shadcn/UI components
│   │   ├── forms/            # Form components
│   │   └── layout/           # Layout components
│   ├── lib/                   # Utilities and configurations
│   │   ├── auth.ts           # Better Auth config
│   │   ├── db.ts             # Database connection
│   │   ├── validations.ts    # Zod schemas
│   │   └── utils.ts          # Utility functions
│   ├── types/                # TypeScript definitions
│   └── drizzle/              # Database schema
├── public/                   # Static assets
├── .env.example             # Environment variables template
├── drizzle.config.ts        # Drizzle configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 🔧 Configuration Files

### Next.js Configuration
- Supports TypeScript out of the box
- Configured for Better Auth
- Optimized for production builds

### Drizzle Configuration
- PostgreSQL adapter
- Schema introspection
- Migration support

### Better Auth Configuration
- Google OAuth provider
- Session management
- Secure cookie handling

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Drizzle ORM for database operations
- Implement proper error handling
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check environment variables
   - Ensure database exists

2. **Authentication Problems**
   - Verify Google OAuth credentials
   - Check BETTER_AUTH_URL matches your domain
   - Ensure BETTER_AUTH_SECRET is set

3. **Build Errors**
   - Clear `.next` folder and rebuild
   - Check TypeScript errors
   - Verify all dependencies are installed

### Getting Help
- Create an issue in the repository
- Check existing issues for solutions
- Review the documentation
- Contact the development team

## 📈 Performance & Monitoring

- Built-in Next.js analytics
- Better Auth session monitoring
- Database query optimization with Drizzle
- Check `/api/health` for system status

## 🔒 Security Features

- **Better Auth** - Secure authentication
- **Session Management** - Automatic session handling
- **CSRF Protection** - Built-in protection
- **SQL Injection Prevention** - Drizzle ORM protection
- **Environment Variables** - Secure configuration

---

**Built with ❤️ using Next.js, TypeScript, Drizzle ORM, and Better Auth**

For more information, visit the [official documentation](https://github.com/your-repo/kandid).
