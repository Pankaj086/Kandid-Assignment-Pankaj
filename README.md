# Kandid - Lead & Campaign Management Platform

A modern Next.js application for managing leads and campaigns, built with TypeScript, Drizzle ORM, and Better Auth. Replicated from the Linkbird.ai platform interface.

## 🚀 Features

- **Authentication System** - Complete auth flow with Better Auth
  - Email/password login and registration
  - Google OAuth integration
  - Protected routes middleware
  - Session management
- **Lead Management** - Comprehensive lead tracking and management
  - Infinitely scrollable leads table
  - Lead detail side sheets with full information
  - Search and filter capabilities
  - Status tracking (Pending, Contacted, Responded, Converted)
- **Campaign Management** - Campaign overview and analytics
  - Campaign table with status tracking
  - Progress indicators and success rates
  - Campaign statistics and metrics
  - Status filters (Draft, Active, Paused, Completed)
- **Modern UI** - Professional interface matching Linkbird.ai design
  - Collapsible sidebar navigation
  - Responsive design with Tailwind CSS
  - shadcn/ui components
  - Dark/light theme support

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
The application uses **Better Auth** for authentication with both email/password and Google OAuth support. All protected routes require valid session.

#### Authentication Flow
1. User can sign up with email/password or sign in with Google
2. After authentication, redirected to dashboard
3. Session stored securely with Better Auth
4. Protected routes automatically redirect to login if unauthenticated

#### Authentication Endpoints
```
GET  /api/auth/[...all]  - Better Auth handler (handles all auth routes)
```

**Better Auth Routes:**
- `/api/auth/sign-in/google` - Initiate Google OAuth
- `/api/auth/sign-in/email` - Email/password sign in
- `/api/auth/sign-up/email` - Email/password registration
- `/api/auth/callback/google` - OAuth callback
- `/api/auth/session` - Get current session
- `/api/auth/sign-out` - Sign out user

### API Endpoints

#### Leads
```bash
GET    /api/leads                # Get all leads (infinite scroll)
POST   /api/leads                # Create new lead
GET    /api/leads/[id]           # Get lead details
PUT    /api/leads/[id]           # Update lead
DELETE /api/leads/[id]           # Delete lead
GET    /api/leads/search         # Search leads
```

#### Campaigns
```bash
GET    /api/campaigns            # Get all campaigns
POST   /api/campaigns            # Create new campaign
GET    /api/campaigns/[id]       # Get campaign details
PUT    /api/campaigns/[id]       # Update campaign
DELETE /api/campaigns/[id]       # Delete campaign
GET    /api/campaigns/stats      # Get campaign statistics
```

### Request/Response Examples

#### Create Lead
```bash
POST /api/leads
Content-Type: application/json
Authorization: Bearer <session-token>

{
  "name": "John Doe",
  "email": "john.doe@company.com",
  "company": "Tech Corp",
  "campaignId": "uuid-here",
  "status": "pending"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "company": "Tech Corp",
    "campaignId": "uuid-here",
    "status": "pending",
    "lastContactDate": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🗄️ Database Schema

The application uses **Drizzle ORM** with PostgreSQL for robust data management.

### Schema Overview

#### Users Table (Better Auth)
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

#### Campaigns Table
```sql
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  total_leads INTEGER DEFAULT 0,
  successful_leads INTEGER DEFAULT 0,
  response_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE
);
```

#### Leads Table
```sql
CREATE TABLE leads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'responded', 'converted')),
  last_contact_date TIMESTAMP,
  notes TEXT,
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

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

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
│   │   │   ├── leads/         # Leads API
│   │   │   └── campaigns/     # Campaigns API
│   │   ├── (auth)/           # Authentication pages
│   │   │   ├── login/        # Login page
│   │   │   └── register/     # Registration page
│   │   ├── (dashboard)/      # Protected dashboard routes
│   │   │   ├── leads/        # Leads management
│   │   │   ├── campaigns/    # Campaign management
│   │   │   └── settings/     # Settings page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing/redirect page
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── auth/             # Authentication components
│   │   ├── leads/            # Lead-specific components
│   │   ├── campaigns/        # Campaign-specific components
│   │   └── layout/           # Layout components (Sidebar, Header)
│   ├── lib/                   # Utilities and configurations
│   │   ├── auth.ts           # Better Auth config
│   │   ├── db.ts             # Database connection
│   │   ├── validations.ts    # Zod schemas
│   │   └── utils.ts          # Utility functions
│   ├── hooks/                # Custom React hooks
│   │   ├── use-leads.ts      # TanStack Query hooks for leads
│   │   └── use-campaigns.ts  # TanStack Query hooks for campaigns
│   ├── stores/               # Zustand stores
│   │   ├── sidebar.ts        # Sidebar state
│   │   ├── leads.ts          # Lead selection state
│   │   └── ui.ts             # UI state (modals, sheets)
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

## 🛠️ Tech Stack

- **Next.js 15+** - React framework with App Router
- **Tailwind CSS + shadcn/ui** - Styling and component library
- **PostgreSQL + Drizzle ORM** - Database and type-safe ORM
- **Better Auth** - Authentication (credentials + Google OAuth)
- **TanStack Query** - Server state management
- **Zustand** - Client-side state management
- **TypeScript** - Type safety throughout

## ✨ Key Features Implementation

### Authentication System
- Complete Better Auth integration
- Email/password and Google OAuth
- Protected routes middleware
- Session management
- Clean, responsive UI

### Leads Management
- Infinitely scrollable table
- Lead detail side sheets
- Search and filter functionality
- Status tracking and updates
- Smooth animations and interactions

### Campaign Management
- Campaign overview table
- Progress indicators and statistics
- Success rate calculations
- Status management
- Visual progress bars

### UI/UX Excellence
- Collapsible sidebar navigation
- Professional Linkbird.ai design replication
- Responsive across all devices
- Loading states and error handling
- Accessibility considerations

## 🎯 Assignment Completion

This project fulfills all requirements from the Kandid Full Stack Developer internship assignment:

✅ **Authentication System** - Better Auth with email/password + Google OAuth  
✅ **Application Layout** - Collapsible sidebar with navigation  
✅ **Leads Section** - Complete leads management with side sheets  
✅ **Campaigns Section** - Campaign table with statistics  
✅ **Technical Requirements** - Next.js 15, Drizzle ORM, TanStack Query, Zustand  
✅ **Database Schema** - Proper schema design with relationships  
✅ **Performance** - Optimized queries, infinite scrolling, proper state management  
✅ **Design** - Linkbird.ai UI replication with shadcn/ui components  

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Verify Google OAuth credentials in Google Cloud Console
   - Check BETTER_AUTH_URL matches your domain
   - Ensure BETTER_AUTH_SECRET is properly set

2. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check all database environment variables
   - Ensure database exists and schema is pushed

3. **Build/Runtime Errors**
   - Clear `.next` folder and rebuild
   - Check TypeScript errors
   - Verify all dependencies are installed

For questions about this assignment, contact: pulkit@kandid.ai

---

**Built for the Kandid internship assignment - replicating Linkbird.ai platform interface**
