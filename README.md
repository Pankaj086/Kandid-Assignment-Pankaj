# Kandid - Candidate Management System

A modern Next.js application for managing candidates, built with TypeScript and modern web technologies.

## 🚀 Features

- Candidate profile management
- Application tracking
- Interview scheduling
- Document management
- Real-time notifications
- Role-based access control

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm, yarn, pnpm, or bun
- Git

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

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your-database-connection-string"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# External APIs
API_BASE_URL="your-api-base-url"

# File Storage
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="5242880" # 5MB
```

### 4. Database Setup

```bash
# Run database migrations
npm run db:migrate

# Seed the database (optional)
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
All API endpoints require authentication via JWT tokens.

#### Endpoints

##### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create new candidate
- `GET /api/candidates/[id]` - Get candidate by ID
- `PUT /api/candidates/[id]` - Update candidate
- `DELETE /api/candidates/[id]` - Delete candidate

##### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Submit new application
- `GET /api/applications/[id]` - Get application details
- `PUT /api/applications/[id]/status` - Update application status

##### Interviews
- `GET /api/interviews` - Get scheduled interviews
- `POST /api/interviews` - Schedule new interview
- `PUT /api/interviews/[id]` - Update interview details
- `DELETE /api/interviews/[id]` - Cancel interview

### Request/Response Examples

#### Create Candidate
```bash
POST /api/candidates
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": 5
}
```

## 🗄️ Database Schema

### Tables

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Candidates
```sql
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  skills TEXT[],
  experience INTEGER,
  resume_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Applications
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id),
  position VARCHAR(200) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);
```

#### Interviews
```sql
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id),
  interviewer_id UUID REFERENCES users(id),
  scheduled_at TIMESTAMP NOT NULL,
  duration INTEGER DEFAULT 60,
  location VARCHAR(200),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'scheduled'
);
```

### Relationships
- One candidate can have multiple applications
- One application can have multiple interviews
- One user (interviewer) can conduct multiple interviews

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

2. **Environment Variables**
   Set the following in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `API_BASE_URL`

### Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t kandid .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="your-database-url" \
     -e NEXTAUTH_SECRET="your-secret" \
     kandid
   ```

### Manual Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📁 Project Structure

```
kandid/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── candidates/        # Candidate pages
│   ├── applications/      # Application pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── lib/                   # Utilities and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── types/                # TypeScript type definitions
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 📈 Performance Monitoring

The application includes built-in performance monitoring. Check the `/api/health` endpoint for system status.

---

Built with ❤️ using Next.js and TypeScript
