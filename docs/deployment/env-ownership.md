# Environment Ownership

This matrix documents deploy-time environment ownership for the split AMS, Portal,
and API applications. App-local schemas should validate only the variables marked
as required for that app. Shared packages should import narrow config slices from
`packages/config/src/env/*` so one feature does not force unrelated environment
variables to exist.

| Variable | Owner app/package | Required in AMS? | Required in Portal? | Required in API? | Notes |
| --- | --- | --- | --- | --- | --- |
| `NODE_ENV` | each app | yes | yes | yes | Validated by every app-local env schema. |
| `DATABASE_URL` | `packages/db` / each app | yes | yes | yes | Required by Drizzle and Auth.js adapters. |
| `AUTH_SECRET` | AMS, Portal | yes | yes | no | Auth.js secret for cookies/JWTs. |
| `GOOGLE_CLIENT_ID` | AMS | yes | no | no | AMS Google OAuth provider. |
| `GOOGLE_CLIENT_SECRET` | AMS | yes | no | no | AMS Google OAuth provider. |
| `AUTH_MICROSOFT_ENTRA_ID_ID` | AMS | yes | no | no | AMS Microsoft Entra ID provider. |
| `AUTH_MICROSOFT_ENTRA_ID_SECRET` | AMS | yes | no | no | AMS Microsoft Entra ID provider. |
| `AUTH_MICROSOFT_ENTRA_ID_ISSUER` | AMS | yes | no | no | AMS Microsoft Entra ID issuer URL. |
| `AUTH_RESEND_KEY` | Portal | no | yes | no | Portal Auth.js magic-link provider. |
| `AUTH_RESEND_FROM` | Portal | no | yes | no | Portal Auth.js magic-link sender. |
| `AUTH_URL` | AMS, Portal Auth.js runtime | no | no | no | Not schema-required for Auth.js v5 on Vercel; set only for explicit canonical/custom base path needs. |
| `NEXTAUTH_URL` | none | no | no | no | Legacy-style variable; not required by current Auth.js v5 setup. |
| `AUTH_TRUST_HOST` | AMS, Portal Auth.js runtime | no | no | no | Vercel is auto-detected by Auth.js. Set to `true` only for self-hosted/reverse-proxy deployments if needed. |
| `AUTH_REDIRECT_PROXY_URL` | AMS OAuth preview support | no | no | no | Optional for stable OAuth redirect proxy support on preview deployments. |
| `API_BASE_URL` | AMS, Portal API proxy | yes | yes | no | Server-only base URL used by app-local proxy clients to call `apps/api`. |
| `API_INTERNAL_AUTH_SECRET` | AMS, Portal, API | yes | yes | yes | Shared HMAC secret for signed internal API calls. Must match across all three apps and be at least 32 characters. |
| `CRON_SECRET` | API | no | no | yes | Protects API cron route invocations. |
| `PORTAL_APP_URL` | API / portal email config | no | no | yes | Used when API sends portal invite links. |
| `PORTAL_EMAIL_API_KEY` | API / portal email config | no | no | yes | API-owned transactional email key for portal invite/notification workflows. |
| `PORTAL_EMAIL_FROM` | API / portal email config | no | no | yes | API-owned sender for portal invite/notification workflows. |
| `ARMCARE_STATUS` | API / ArmCare config | no | no | yes | Selects staging or production ArmCare endpoints. |
| `ARMCARE_USERNAME` | API / ArmCare config | no | no | yes | ArmCare sync credential. |
| `ARMCARE_PASSWORD` | API / ArmCare config | no | no | yes | ArmCare sync credential. |
| `ARMCARE_AUTH_URL_STAGING` | API / ArmCare config | no | no | yes | Staging auth endpoint. |
| `ARMCARE_API_URL_STAGING` | API / ArmCare config | no | no | yes | Staging API endpoint. |
| `ARMCARE_AUTH_URL_PROD` | API / ArmCare config | no | no | yes | Production auth endpoint. |
| `ARMCARE_API_URL_PROD` | API / ArmCare config | no | no | yes | Production API endpoint. |
| `AZURE_STORAGE_ACCOUNT_NAME` | API / Azure storage config | no | no | yes | API owns direct blob storage access. AMS/Portal proxy file access through API. |
| `AZURE_STORAGE_CONNECTION_STRING` | API / Azure storage config | no | no | yes | API owns direct blob storage access. |
| `AZURE_STORAGE_CONTAINER_NAME` | API / Azure storage config | no | no | yes | API owns direct blob storage access. |
| `PUPPETEER_EXECUTABLE_PATH` | AMS PDF runtime | optional | no | optional | Optional local override. Remote/Vercel PDF runtime uses bundled Chromium path. |

## Verification Commands

Run these before deploys that affect app env, shared packages, or build config:

```bash
pnpm --filter @ams/ams build
pnpm --filter @ams/portal build
pnpm --filter @ams/api build
```
