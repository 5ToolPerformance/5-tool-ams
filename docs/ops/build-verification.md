# Build Verification

`pnpm build:all` is the CI/local verification command for production builds.
It runs the legacy app, API app, AMS app, and portal app in sequence through
`scripts/build-all.ps1`.

## Runtime Pages

Pages and layouts that read session state, request context, runtime env, or the
database are marked with:

```ts
export const dynamic = "force-dynamic";
```

This prevents Next.js from prerendering those routes during `next build` and
keeps local/CI builds from requiring live database reads.

## Env Loading

Deployable apps own runtime env loading. Shared packages only validate and
consume `process.env`; they do not load root or current-working-directory dotenv
files. See `docs/ops/env-ownership.md`.

The build script loads env files in this order:

1. root `.env.local`
2. root `.env`
3. app `.env`
4. app `.env.local`

App-local env files override root values for that app build. For CI build
verification, the script fills missing required variables with valid placeholder
values so env validation can run without production secrets. These placeholders
are build-time only; deployment environments must still provide real runtime
values.

## Required Runtime Env

Deployments must provide real values for each app's server env schema:

- `apps/legacy/src/env/server.ts`
- `apps/api/src/env/server.ts`
- `apps/ams/src/env/server.ts`
- `apps/portal/src/env/server.ts`

`DATABASE_URL` is still required at runtime, but dynamic route configuration
prevents build-time page prerender from querying it.

## CI Command

```powershell
pnpm typecheck:all
pnpm lint:all
pnpm build:all
```

Use `scripts/build-all.ps1 -SkipEnvDefaults` only when CI should fail on any
missing build env variable instead of using placeholders.

After the build passes and the apps are deployed to staging, use
`docs/ops/staging-smoke-test-checklist.md` to verify runtime behavior with real
app-specific secrets.
