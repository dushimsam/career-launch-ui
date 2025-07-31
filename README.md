# CareerLaunch UI

This is the frontend application for the CareerLaunch platform, built with Next.js 15, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager
- The backend server running on http://localhost:8000

### Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd /Users/samueldushimimana/Documents/alu/projects/career-launch-ui
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Update the `.env.local` file with your backend URL if different from default:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Running the Application

Start the development server:
```bash
yarn dev
```

The application will be available at http://localhost:3000

## Project Structure

```
src/
├── app/                    # Next.js app directory (pages)
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── student/           # Student dashboard and pages
│   ├── recruiter/         # Recruiter dashboard and pages
│   └── verify-email/      # Email verification page
├── components/            # Reusable components
│   ├── ui/               # UI components (Button, Card, etc.)
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
└── lib/                  # Utilities and configurations
    ├── api.ts           # Axios configuration
    └── utils.ts         # Utility functions
```

## Features Implemented

### Authentication
- User registration with role selection (Student, Recruiter, University Admin)
- Login with email/password
- JWT token management with refresh
- Protected routes based on user roles
- Email verification flow
- GitHub OAuth integration ready

### Pages
- Landing page with feature highlights
- Login page
- Registration page with role-specific fields
- Student dashboard with stats and quick actions
- Recruiter dashboard with job management
- Email verification page

### Components
- Reusable UI components using Radix UI primitives
- Consistent styling with Tailwind CSS
- Dark mode support
- Responsive design

## Next Steps

1. **Complete Profile Management**
   - Student profile editing
   - Portfolio integration
   - Skills management

2. **Job Management**
   - Job listing page
   - Job posting for recruiters
   - Application flow

3. **Search & Filtering**
   - Advanced search for jobs
   - Candidate filtering for recruiters

4. **Communication**
   - In-app messaging
   - Notification system

5. **Analytics**
   - Student analytics dashboard
   - Recruiter analytics

## API Integration

The frontend is designed to work with the NestJS backend. Make sure the backend is running before starting the frontend.

Key API endpoints used:
- `/auth/register` - User registration
- `/auth/login` - User login
- `/auth/profile` - Get current user
- `/auth/verify-email` - Email verification
- `/auth/refresh` - Token refresh

## Deployment

For production deployment:

```bash
yarn build
yarn start
```

Consider deploying to:
- Vercel (recommended for Next.js)
- Cloudflare Pages
- Any Node.js hosting platform

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of the CareerLaunch platform.
