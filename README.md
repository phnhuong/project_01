# Student Management System

## Project Structure
- **backend/**: Node.js + Express + Prisma (Connects to Ubuntu Postgres)
- **frontend/**: React + Vite + Tailwind CSS

## Prerequisites
- Node.js 20+
- PostgreSQL 14 (Running on Ubuntu VM 192.168.147.3)

## Setup & Run

### Backend
1. `cd backend`
2. `npm install`
3. `npm run dev`
   - Runs on: http://localhost:3000
   - Swagger/API Docs: (Coming soon)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
   - Runs on: http://localhost:5173

## Environment Variables
- **Backend:** `.env` (Database URL)
- **Frontend:** `.env` (API URL)
