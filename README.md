# CareerLaunch UI

This is the frontend application for the CareerLaunch platform, built with Next.js 15, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager
- The backend server running on http://localhost:7700

### Installation

1. Clone & Install dependencies:
```bash
git clone https://github.com/dushimsam/career-launch-ui.git
cd career-launch-ui
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


## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of the CareerLaunch platform.
