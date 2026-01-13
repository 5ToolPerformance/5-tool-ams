# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

5 Tool Performance Athlete Management System - a full-stack platform for coaches/admins to manage athletes, capture lesson data, track assessments, and sync external Arm Care data. Built with Next.js 15 App Router, Drizzle ORM with Neon Postgres, NextAuth authentication (Google & Microsoft Entra ID), and HeroUI components.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build (includes type-checking)
pnpm lint         # ESLint with Next.js, React hooks, and file-name conventions
pnpm format       # Prettier with Tailwind class sorting

# Database
pnpm drizzle-kit generate   # Generate migrations from schema changes
pnpm drizzle-kit push       # Push migrations to database

# Testing
pnpm jest                   # Run all tests
pnpm jest path/to/file      # Run specific test file
pnpm jest --watch           # Watch mode
```

## Architecture

### Layer Structure
```
src/
├── app/           # Next.js App Router - routes, API handlers, layouts
├── application/   # Use cases/orchestration (e.g., createLesson, updateLesson)
├── domain/        # Business logic, types, transformations (hydrate, normalize)
├── db/
│   ├── schema/    # Drizzle table definitions
│   ├── queries/   # Reusable Drizzle query functions
│   └── migrations/
├── lib/
│   ├── services/  # Domain services (lessons, players, assessments, coaches)
│   ├── schemas/   # Zod validation schemas
│   └── utils/
├── ui/
│   ├── core/      # Base UI components with tests
│   └── features/  # Feature-specific UI (lesson-form, lessons, mechanics)
├── components/    # Shared React components (forms, charts, layouts, dashboards)
├── hooks/         # Custom React hooks
└── types/         # Shared TypeScript definitions
```

### Key Patterns
- **Path alias**: Use `@/*` for imports (maps to `./src/*`)
- **API routes**: REST-style handlers in `app/api/` that call services
- **Server Components**: Fetch data via services, pass to Client Components
- **Services**: Plain async functions in `lib/services/` for database operations
- **Authentication**: NextAuth with JWT sessions in `src/auth.ts`, roles stored in DB

### Database
- Drizzle ORM with Neon serverless Postgres
- Schema files in `src/db/schema/` - one file per table/domain
- Connection singleton in `src/db/index.ts`
- Environment validation via `@t3-oss/env-nextjs` in `src/env/server.ts`

### Assessment Types
Multiple assessment schemas exist: armCare, pitching, hitting, catching, fielding, motorPreferences, smfa, trueStrength, veloAssessment, hitTrax, and Hawkin force plate data (CMJ, drop jump, iso, multi, tsIso).

## Code Style

- Double quotes, semicolons required
- Prefer arrow functions (`prefer-arrow-callback`)
- Use template literals (`prefer-template`)
- No `process.env` direct access - use `@/env/server`
- Import order: react/next, third-party, @/* aliases, relative
