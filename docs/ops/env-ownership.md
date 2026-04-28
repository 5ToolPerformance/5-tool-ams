# Env Ownership

Each deployable app owns loading its own env files during local development:

- `apps/api/.env.local`, falling back to `apps/api/.env`
- `apps/ams/.env.local`, falling back to `apps/ams/.env`
- `apps/portal/.env.local`, falling back to `apps/portal/.env`

Production deployments must provision the same values directly in the app's
deployment environment. Apps must not depend on repo-root `.env.local` values.

## Shared Packages

Shared packages validate and consume `process.env`; they do not load dotenv
files. This keeps package behavior deterministic when an app is deployed
independently and prevents current-working-directory based env loading from
pulling in an unintended root `.env.local`.

Package env modules such as `@ams/config/env/server` and
`@ams/config/env/database` expect the owning app, worker, test harness, or CI
command to populate `process.env` before importing them.

## Build Verification

`pnpm build:all` uses `scripts/build-all.ps1` to provide deterministic local and
CI build verification. The script may load root env files for repo-level build
convenience and fills placeholder values unless `-SkipEnvDefaults` is passed.
Those build-time defaults are not runtime configuration and must not be treated
as production secrets.

Use `docs/ops/staging-smoke-test-checklist.md` after deploying API, AMS, and
portal to staging with real app-specific environment values.
