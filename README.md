# McBride Tech Learning Lab

A modern, multisensory reading platform designed to help children learn to read through engaging games and progress tracking.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Authentication and database (to be integrated)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup

1. Create a Supabase project and copy your Project URL and publishable (anon) key.
2. Create a local env file:
```bash
cp .env.example .env.local
```
3. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY` for legacy)
   - `NEXT_PUBLIC_SITE_URL` (local + production)
4. Enable providers in Supabase Auth:
   - **Email** for password sign-in
   - **Google** for OAuth
5. Google OAuth settings:
   - In Google Cloud Console, set **Authorized redirect URIs** to your Supabase callback:
     - `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - In Supabase Auth settings, add redirect URLs for your app:
     - `http://localhost:3000/auth/callback`
     - `https://your-domain.com/auth/callback`
   - Supabase Google provider requires your **Client ID** and **Client Secret**.

Note: If you add a service role key later, keep it server-only and never expose it to the browser.

## Project Structure

```
mcbride-tech-learning-lab/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Homepage
│   └── globals.css     # Global styles
├── components/
│   ├── AnimatedBackground.tsx  # Animated background component
│   ├── Header.tsx              # Navigation header
│   ├── MobileMenu.tsx         # Mobile menu overlay
│   └── Section.tsx             # Reusable section wrapper
└── public/                     # Static assets (to be added)
```

## Features

- ✅ Modern, tech-forward homepage with animated background
- ✅ Mobile-first responsive design
- ✅ Accessible navigation with mobile menu
- ✅ Games overview section
- ✅ Progress tracking preview
- ✅ Key features showcase
- ✅ Sign up / Log in section
- ✅ Footer with links

## Next Steps

- Add logo and favicon
- Integrate Supabase authentication
- Implement game pages
- Add progress tracking functionality
- Set up database schema

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

Private project - All rights reserved
