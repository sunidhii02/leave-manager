# LeaveFlow

> A polished leave management experience for employees, managers, and admins.

## Features
- Submit and review leave requests from a shared workspace
- View dashboard summaries and request history
- Manage leave types and employee balances from an admin console

## Tech Stack
Next.js · TypeScript · Tailwind CSS · MongoDB · Mongoose · JWT

## Quick Start
```bash
git clone <repo-url>
cd app
cp .env.example .env.local
npm install
npm run dev
```

## Environment Variables
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: signing secret for JWT auth

## Demo Credentials
- Employee: ava@acme.io
- Manager: marcus@acme.io
- Admin: jules@acme.io

## Architecture
The app uses a simple role-based data model with sample leave requests, balances, and leave types rendered through the Next.js App Router.

## License
MIT
