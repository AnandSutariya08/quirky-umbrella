# Quirky Umbrella - AI-Led Marketing Systems

## Overview
A Next.js 15 marketing website for "Quirky Umbrella" - an AI-led marketing systems company. The site features a modern, responsive design with Firebase integration for backend services.

## Tech Stack
- **Framework**: Next.js 15.1.11 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom configuration
- **Backend**: Firebase (Firestore, Authentication)
- **Charts**: Recharts for data visualization
- **Icons**: Heroicons, Lucide React

## Project Structure
```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
├── contexts/      # React context providers
├── lib/           # Utility libraries and Firebase config
├── styles/        # Global CSS and Tailwind styles
└── types/         # TypeScript type definitions
```

## Development
- **Port**: 5000 (configured for Replit)
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Start Production**: `npm run start`

## Environment Variables
Firebase configuration is stored in `.env`:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Key Features
- Home page with hero section and marketing content
- Blog section
- Contact and discussion pages
- Admin panel
- Growth audit form
- Responsive design with gradient backgrounds

## Recent Changes
- **2026-01-26**: Configured for Replit environment
  - Updated port to 5000
  - Configured host binding to 0.0.0.0
  - Set up Next.js Dev Server workflow
  - Configured autoscale deployment
