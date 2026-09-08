# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The Illinois Nutrient Loss Reduction Strategy (NLRS) Biennial Report Dashboard: a content-driven
public site where nearly everything on a page — text, charts, images, layout order — is authored in
Strapi rather than hardcoded in the frontend. Three deployable pieces live in one repo:

- `next/` — Next.js 15 App Router frontend (React 19, MUI, Recharts)
- `cms/` — Strapi v5 headless CMS backed by PostgreSQL
- `scripts/elasticsearch/` — Python indexer that pushes Strapi content into Elasticsearch for site search
- `scripts/cron_jobs/box_backups/` — Python job that backs up Strapi and uploads to Box

## Commands

### Frontend (`next/`)

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # standalone output
npm run lint       # next lint
npm run lint:fix   # next lint --fix (also what the pre-commit hook runs, via yarn)
```

Note the Dockerfile installs with `yarn --frozen-lockfile` while local dev typically uses npm; both
`yarn.lock` and `package-lock.json` are committed. Keep whichever lockfile you touch in sync.

### Backend stack (Strapi + Postgres + Elasticsearch)

```bash
cp .env.example .env    # fill DATABASE_PASSWORD and the Strapi secrets
docker compose -f docker-compose.dev.yml up -d
docker compose -f docker-compose.dev.yml logs -f strapi
```

Strapi at `http://localhost:1337` (admin `/admin`), Postgres at `5432`, Elasticsearch at `9200`
(security disabled in dev). `cms/src`, `cms/config`, and `cms/public/uploads` are bind-mounted, so
edits hot-reload inside the container — do not rebuild the image for schema changes.

To exercise the production Strapi image locally, uncomment the `strapi-prod` service and run
`docker compose -f docker-compose.dev.yml --profile prod up --build strapi-prod strapiDB`.

### Strapi data snapshots

```bash
npm run strapi export -- --file strapi-data-<date> --no-encrypt
npm run strapi import -- -f ~/path/to/strapi-data-<date>.tar.gz
```

Snapshots live in the team Box folder, not in git (the `.tar.gz` files at `cms/` root are stale local copies).

### Search indexing (`scripts/elasticsearch/`)

```bash
uv pip install -r requirements.txt
set -a && source .env && set +a
python index_content.py    # recreates the `ilnlrs-content` index from Strapi
```

Search is **not** live — the index is a snapshot. After importing CMS data or publishing content
changes, re-run the indexer or search results go stale.

### Tests

There is no automated test suite. Verification is manual: run the dev stack and check pages, or rely
on lint. Pre-commit hooks (`pre-commit install`) run yaml/whitespace checks plus ESLint on `next/src`.

## Architecture

### The rendering pipeline

Almost all pages funnel through one path:

1. A route (`next/src/app/page.tsx` for home, `next/src/app/[page-group]/[slug]/page.tsx` for
   everything else) calls `fetchContentType` from `next/src/utils/strapi/fetchContentType.ts`.
2. Strapi returns a `pageContents` **dynamic zone**: an ordered array of components, each tagged with
   `__component` (e.g. `content.heading`, `charts.chart-selector`).
3. `PageContentGenerator` maps over that array and `ComponentRenderer`
   (`next/src/components/PageContentGenerator/ComponentRenderer.tsx`) switches on `__component` to
   pick a React component.

**Adding a new content component therefore requires four coordinated changes:**

1. Create the component JSON in `cms/src/components/<category>/<name>.json`
2. Add its UID to the `pageContents` dynamic zone in `cms/src/api/page/content-types/page/schema.json`
   (and/or `home/schema.json`)
3. Add a `case '<category>.<name>':` to `ComponentRenderer` returning the React component
4. Register an extractor in `EXTRACTORS` in `scripts/elasticsearch/text_extractors.py`, or its text
   will silently never be searchable (the indexer only warns)

`cms/src/middlewares/deepPopulate.ts` (registered as `global::deepPopulate` in
`cms/config/middlewares.ts`) auto-populates every relation/media/component/dynamic-zone level, so REST
calls do not need explicit `populate` params. Component data arrives fully hydrated.

### Charts

Charts are data, not code. A `Chart` collection type holds a `chartType` enum plus two JSON blobs:
`chartData` (the rows) and `miscChartData` (per-series config: colors, stroke widths, axis labels).
`BaseChart.tsx` switches on `chartType` and hands both to the matching Recharts wrapper in
`next/src/components/charts/`. Adding a chart *type* means extending the `chartType` enum in
`cms/src/api/chart/content-types/chart/schema.json` **and** the switch in `BaseChart.tsx`. Adding a
chart *instance* is pure CMS work — no code change.

`BaseChart` also owns the shared chrome: caption (split on `:` for bold/regular halves), info popover,
data-file download, and PNG export via html2canvas.

### Routing

- `/[page-group]/[slug]` — CMS-driven pages, filtered by both `pageGroup` and `slug`. `force-dynamic`;
  `generateStaticParams` exists but is effectively unused because of that.
- `/[page-group]/dashboard/[slug]` — a client component holding **hardcoded Tableau embed HTML** in
  `tableau_dashboard_dict`, injected via `injectHtmlWithScripts`. Tableau dashboards are pasted in as
  raw embed code keyed by slug; they are not CMS content.
- `/search` + `/api/search` — Elasticsearch multi_match over `title^3`, `headings^2`, `searchableText`,
  `excerpt` with highlighting.
- `/api/preview` — Strapi preview handshake (see below).

### Draft preview

`cms/config/admin.ts` builds a preview URL (`getPreviewPathname` maps content-type UID → frontend path)
and hits `/api/preview` with `PREVIEW_SECRET`. That route validates the secret and toggles Next.js draft
mode. `fetchContentType` then appends `status=draft` and an `Authorization: Bearer CMS_READ_ONLY_TOKEN`
header — **but only when `Sec-Fetch-Dest: iframe`**, so a stale draft cookie cannot leak unpublished
content into normal browsing. `PREVIEW_SECRET` must match between `cms/.env` and `next/.env`.

### Rich text

CKEditor HTML from Strapi is rendered by `RichComponentViewer`, which sanitizes with
isomorphic-dompurify and rewrites relative `/uploads` paths to absolute `CMS_URL` paths. Editing that
component means touching a regex-based HTML post-processor — read it before changing.

### Layout and navigation

`next/src/app/layout.tsx` fetches the `global` single type once for navbar and footer, and renders a
"Loading…" fallback shell if Strapi is unreachable. The `Sidebar` builds its table of contents by
scanning the rendered DOM for `h2`/`h3` elements at runtime — it does not read CMS data — and offsets
scroll positions by a `NAVBAR_HEIGHT` constant plus the measured maintenance-alert banner height.

## Deployment

GitHub Actions build and push to `hub.ncsa.illinois.edu` (`il-nrs/strapi`, `il-nrs/frontend`) on
pushes to `main` and PRs touching the respective directory. `CMS_URL` is baked in at **build time** as
a Docker build arg, so prod and dev frontend images are separate builds off the same commit
(`frontend-docker.yaml` pushes both, tagging the dev one `dev-main`). Production runs
`docker-compose.prod.yml`: Traefik v3 with Let's Encrypt in front of frontend, Strapi, Postgres, and
Elasticsearch. Image tags in that file are pinned by hand and must be bumped to deploy.

`common_issues.md` is a running log of production operational gotchas — check it before debugging a
deployment problem, and append to it when you solve a new one.

## Conventions

- Prettier: 4-space indent, single quotes, 120 columns, semicolons. ESLint enforces it as an error.
- Imports use the `@/*` → `next/src/*` alias.
- Strapi responses are typed loosely (`any` with targeted eslint-disable comments); don't invent strict
  types for CMS payloads unless asked.
- Frontend errors are logged and degraded into `notFound()` or fallback UI rather than thrown.
