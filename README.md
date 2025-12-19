<img width="120" src="public/icon.png" alt="5 Tool Performance logo" />

# 5 Tool Performance – Athlete Management System

> **Internal project**: This repository is private and intended solely for the 5 Tool Performance engineering and coaching teams.

A full-stack platform for coaches and admins to manage athletes, capture lesson data, track assessments, and sync external Arm Care data. The project is built on Next.js App Router with a typed Drizzle ORM/Postgres backend, NextAuth authentication, and HeroUI components for the interface.

## Table of Contents

1. [Feature Highlights](#feature-highlights)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Development Workflow](#development-workflow)
7. [Database & Migrations](#database--migrations)
8. [Scheduled Jobs](#scheduled-jobs)
9. [Testing & Quality](#testing--quality)
10. [Deployment](#deployment)
11. [Contributing](#contributing)

---

## Feature Highlights

- **Role-aware dashboards** for admins, coaches, and players with protected routes via NextAuth sessions.
- **Lesson management** with multi-assessment workflows (pitching, hitting, arm care, motor preferences, etc.).
- **Player records** capturing biographical data, measurements, write-ups, and reports.
- **External data sync** for Arm Care metrics via a scheduled cron endpoint.
- **Next.js App Router UI** with a responsive sidebar layout, theme switching, and HeroUI components.
- **Typed services** that isolate database access using Drizzle ORM and Neon serverless Postgres.

## Architecture

```
Next.js App Router (app/*)
├─ Layout Providers (HeroUI, Theme, Session)
├─ Route Handlers (app/api/**)
│   └─ Call domain services in src/lib/services/*
├─ Server Components (data fetching via services)
└─ Client Components (forms, charts, dashboards)

Drizzle ORM
├─ Schema definitions (src/db/schema)
└─ Neon/Postgres connection (src/db/index.ts)

NextAuth (src/auth.ts)
├─ Google & Microsoft Entra ID providers
└─ JWT sessions enriched with role & user id

Cron / Integrations
└─ /api/cron/armcare-sync scheduled via vercel.json
```

## Project Structure

```
├── src/
│   ├── app/                 # App Router routes, API handlers, global layout
│   │   ├── api/             # REST-style route handlers per domain
│   │   └── (pages)          # Auth-protected dashboards & forms
│   ├── components/          # UI building blocks, forms, charts, layouts
│   ├── db/                  # Drizzle schema definitions & migrations
│   ├── lib/
│   │   ├── services/        # Domain services (players, lessons, assessments, ...)
│   │   └── utils            # Helper utilities
│   ├── env/                 # Environment validation via @t3-oss/env-nextjs
│   ├── hooks/               # Shared React hooks
│   ├── types/               # Shared TypeScript definitions
│   └── utils/               # Misc utilities (formatters, etc.)
├── public/                  # Static assets (backgrounds, icons)
├── drizzle.config.ts        # Drizzle migration configuration
├── tailwind.config.ts       # Tailwind design tokens
├── eslint.config.mjs        # ESLint setup
├── jest.config.js           # Testing configuration
└── vercel.json              # Cron / deployment metadata
```

> Absolute imports are enabled via the `@/*` alias defined in `tsconfig.json`.

## Getting Started

### Prerequisites

- Node.js 18.18+ (Next.js 15 requirement)
- pnpm 8+
- Access to the required environment secrets (see below)

### Installation

```bash
pnpm install
```

### Running locally

```bash
pnpm dev
```

Open http://localhost:3000 and sign in with a configured provider account.

## Environment Variables

All variables are validated in `src/env/server.ts` before the app boots, ensuring misconfigurations fail fast:

| Variable                                                 | Description                                                       |
| -------------------------------------------------------- | ----------------------------------------------------------------- |
| `NODE_ENV`                                               | `development` or `production`                                     |
| `AUTH_URL`, `AUTH_SECRET`                                | NextAuth configuration                                            |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`               | Google OAuth credentials                                          |
| `AUTH_MICROSOFT_ENTRA_ID_ID`, `..._SECRET`, `..._ISSUER` | Microsoft Entra ID OAuth credentials                              |
| `DATABASE_URL`                                           | Neon/Postgres connection string                                   |
| `CRON_SECRET`                                            | Shared secret for cron route authentication                       |
| `ARMCARE_*`                                              | Credentials and URLs for Arm Care sync (staging & prod endpoints) |

Create a `.env.local` file mirroring these keys before running the app.

## Development Workflow

- `pnpm dev` – Next.js dev server with hot reload.
- `pnpm lint` – ESLint (configured for Next.js, React hooks, and file-name conventions).
- `pnpm format` – Prettier with Tailwind class sorting.
- `pnpm build` – Production build (runs type-checks and Next.js build pipeline).
- `pnpm start` – Run the production build locally.

## Database & Migrations

- Schemas live in `src/db/schema`. Update them before generating migrations.
- Drizzle config (`drizzle.config.ts`) points to `./src/db/migrations` and uses the same `DATABASE_URL` as the app.
- Typical workflow:
  ```bash
  pnpm drizzle-kit generate
  pnpm drizzle-kit push
  ```
  or run migrations via CI/CD depending on deployment strategy.

## Scheduled Jobs

`vercel.json` schedules the Arm Care sync endpoint:

```json
{
  "crons": [{ "path": "/api/cron/armcare-sync", "schedule": "0 7 * * *" }]
}
```

Ensure the cron endpoint checks `CRON_SECRET` and only runs in trusted environments (see `src/app/api/cron/*`).

## Testing & Quality

- Jest with `jsdom` powers component and hook tests; Testing Library helpers are preinstalled.
- ESLint and Prettier enforce consistent style. Consider running them pre-commit (e.g., via Husky/lint-staged if desired).
- Domain services are plain async functions, making them straightforward to unit test with mocked Drizzle clients.

## Deployment

1. Provision environment variables in your hosting provider (Vercel recommended).
2. Configure the cron job (Vercel or external scheduler) to call `/api/cron/armcare-sync`.
3. Deploy via `vercel --prod` or your CI pipeline after `pnpm build` passes.

## Contributing

Internal workflow only—please do **not** fork or publish this repository.

1. Create a feature branch from `main`: `git checkout -b feat/<ticket-id>-<summary>`.
2. Make your changes and keep commits scoped.
3. Run `pnpm lint` (and relevant tests) before pushing.
4. Open a PR in the private repo referencing the Linear/Jira ticket, architectural notes, and testing evidence.

---

Questions or requests? Open an issue or reach out to the 5 Tool Performance engineering team.
