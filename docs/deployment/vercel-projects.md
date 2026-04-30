# Vercel Projects

Deploy AMS, Portal, and API as three separate Vercel projects. Each project
should use its app directory as the Vercel root and run that app's local
`pnpm build` script.

| Project | Root | Build |
| --- | --- | --- |
| AMS | `apps/ams` | `pnpm build` |
| Portal | `apps/portal` | `pnpm build` |
| API | `apps/api` | `pnpm build` |

## Required Setting

Enable **Include source files outside of root directory** for all three projects.
The apps import shared workspace packages from `packages/*`, so Vercel must
include files outside each app root.

## Root Build Guard

Do not configure Vercel to run the repository root `pnpm build`. The root build
script intentionally fails so Vercel cannot accidentally deploy the legacy app
or the wrong target.

Use either:

```bash
pnpm build
```

from the app root configured above, or these root-level verification commands:

```bash
pnpm --filter @ams/ams build
pnpm --filter @ams/portal build
pnpm --filter @ams/api build
```

The combined deployment regression check is:

```bash
pnpm run build:deployables
```

## API Cron Config

`apps/api/vercel.json` contains the API cron schedule. This is correct when the
API Vercel project root is `apps/api`.

If the API project root is ever changed to the repository root, move or duplicate
the cron config into the active root `vercel.json` for that API project.

## Preview OAuth

Preview deployments may break OAuth because providers usually require exact
redirect/callback URLs.

Options:

- Use separate Google/Microsoft provider apps for staging or preview domains.
- Restrict OAuth testing to production and a stable staging domain.
- Use `AUTH_REDIRECT_PROXY_URL` for a stable Auth.js redirect proxy when preview
  deployments need OAuth.

Callback URLs for production/staging provider configuration:

- AMS Google: `https://<ams-domain>/api/auth/callback/google`
- AMS Microsoft Entra ID:
  `https://<ams-domain>/api/auth/callback/microsoft-entra-id`
- Portal Resend magic links should resolve on the Portal domain, with
  `AUTH_RESEND_FROM` using a verified sender/domain.
