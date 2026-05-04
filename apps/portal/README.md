# Portal App

Standalone client portal app. The portal is rooted at `/`, with client-facing routes:

- `/`
- `/journal`
- `/assistant`
- `/messages`
- `/settings`
- `/invite/[token]`

Portal API route handlers live under `/api/portal/*`; they are not AMS/internal proxy routes.
