# Netflix Clone

A full-stack Netflix clone built with React, Node.js, Express, and PostgreSQL (Aiven).

## Features
- **Authentication**: Secure registration and login with JWT and Glassmorphic UI.
- **Movies**: Browse trending, action, comedy, and more using OMDb API.
- **UI**: Netflix-style dark theme with responsive design.

## Quick Start

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Environment Variables

### Backend (`server/.env`)
```
PORT=5000
DATABASE_URL=postgres://avnadmin:...@...aivencloud.com:21225/defaultdb?sslmode=require
JWT_SECRET=shreyasmudigere121
```

### Frontend (`client/.env`)
```
VITE_OMDB_API_KEY=f688f88d
```

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios, React Router, Lucide React
- **Backend**: Node.js, Express, PostgreSQL, bcrypt, JWT
