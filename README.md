# StudySetu

StudySetu is a premium, mobile-first, and production-ready exam-wise daily study planner and secure community platform built for Indian government exam aspirants (UPSC, SSC, RRB, IBPS).

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styles**: Vanilla CSS & custom visual tokens configured natively in `app/globals.css`
- **Icons**: Lucide React
- **Backend/DB**: Supabase (PostgreSQL with RLS safety rules)

## Key Project Features
1. **Dynamic Study Planner**: Enroll in 30, 45, or 90-day schedules. Pause, resume, and track completed checklist tasks.
2. **Mock Test & Quiz Engine**: Integrated exam templates, interactive MCQ review, detailed analytics, time logs, correct/wrong checks, and topic performance analysis.
3. **Materials Catalog**: Search, filter, and review articles, PDFs, videos, and study guides.
4. **Secure Student Community**: Forum categorization, thread creations, solved statuses, reporting guidelines, and administrative moderation audits (lock, pin, warnings, mutings, removals).
5. **UPI Payment Gate Lock**: Optional payment toggles. Premium content is locked behind custom QR billing overlays with manual UTR verification logs.

---

## Supabase Database Setup

To configure Supabase for production:

1. **Create Database Schema**:
   Run the SQL scripts located in the `/supabase` folder:
   - Apply `supabase/schema.sql` inside the Supabase SQL Editor to define all the required tables (exams, plans, user progress, community threads, billing logs).
   - Apply `supabase/seed.sql` to populate initial datasets.

2. **Enable Row Level Security (RLS)**:
   Ensure RLS is enabled on all tables in Supabase. The policies are pre-defined in the `schema.sql` script to prevent unauthorized reads/writes.

---

## Environment Variables Configuration

Copy `.env.example` to `.env.local` and configure your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> [!WARNING]
> Never expose `SUPABASE_SERVICE_ROLE_KEY` inside client-side components. It bypasses RLS and should only be run inside server components or secure API endpoints.

---

## Getting Started

First, install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Verification & Build

Verify code syntax and generate production bundles:

```bash
npm run lint
npm run build
```

---

## Vercel Deployment Instructions

To deploy StudySetu to Vercel:

1. **Push your code** to GitHub or GitLab.
2. **Connect to Vercel**: Import the repository in your Vercel Dashboard.
3. **Configure Environment Variables**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables.
4. **Deploy**: Trigger the deploy pipeline. The sitemaps and search index routes will build automatically.
