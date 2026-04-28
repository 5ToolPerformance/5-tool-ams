# Hawkin Automatic Integration Retirement

Hawkin automatic sync and athlete matching are disabled for the multi-app
deployment.

## Current State

- Hawkin DB tables, migrations, and historical athlete mappings are retained.
- Historical Hawkin force-plate data can still be read by reporting and lesson
  display code paths that already use stored records.
- New automatic Hawkin imports, unlinked-athlete matching workflows, and manual
  creation of new Hawkin external-athlete mappings are disabled.
- The `apps/api` Hawkin unlinked-athletes endpoint now returns `410 Gone` after
  normal admin authentication.
- AMS and legacy Hawkin matching pages now show a retirement notice instead of
  loading unmatched athletes or offering a link action.
- Admin sidebars no longer link to the Hawkin matching page.

## Python Fly.io Worker

No deployable Python worker directory, `fly.toml`, Fly.io deployment config, or
Hawkin worker environment requirement is present in this repository. The
separate Python Fly.io worker is considered retired for this monorepo
deployment. Do not add API, AMS, or portal calls to a Python worker for Hawkin
sync without a new architecture review.

## Env

No Hawkin or Fly.io worker env vars are required by the app-local env schemas.
Do not add `HAWKIN_*`, `FLY_*`, or Python worker URL secrets to `apps/api`,
`apps/ams`, or `apps/portal` unless Hawkin integration is intentionally
reintroduced.

## Preserved Data

The following remain intentionally in place:

- `hawkins_force_plate`
- `hawkins_cmj`
- `hawkins_drop_jump`
- `hawkins_iso`
- `hawkins_multi`
- `hawkins_ts_iso`
- `manual_ts_iso`
- historical `external_athlete_ids` records where `external_system = 'hawkin'`

These tables and records must not be dropped as part of the integration
retirement.

