# Illinois NRS Dashboard

The Illinois Nutrient Loss Reduction Strategy (NLRS) Biennial Report Dashboard — an interactive single-page web application that visualizes nutrient loss data and strategies for the state of Illinois.

The project is a full-stack application composed of a **Next.js** frontend, a **Strapi** headless CMS backed by **PostgreSQL**, and **Elasticsearch** for site search. In production, **Traefik** handles reverse-proxying and automatic TLS via Let's Encrypt.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (React 19), MUI, Recharts, CKEditor 5 |
| CMS | Strapi v5 (headless) |
| Database | PostgreSQL 17 |
| Search | Elasticsearch 9 |
| Reverse Proxy (prod) | Traefik v3 with Let's Encrypt |
| Containerization | Docker / Docker Compose |

---

## Repository Structure

```
illinois-nrs-dashboard/
├── cms/                  # Strapi CMS application
├── next/                 # Next.js frontend
├── scripts/
│   └── elasticsearch/    # Content indexing script
├── docker-compose.dev.yml   # Dev stack (Strapi + DB + Elasticsearch)
├── docker-compose.prod.yml  # Production stack (adds Traefik + frontend container)
└── .env.example          # Root environment variable template
```

---

## Environment Variables

The root `.env.example` covers variables for all services. Copy it before running anything:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `SITE_URL` | Public domain for production (e.g. `ilnrs.ncsa.illinois.edu`) |
| `OLD_SITE_URL` | Legacy domain to redirect from (optional) |
| `EMAIL` | Email for Let's Encrypt certificate registration |
| `LETSENCRYPT_DIR` | Path to directory containing `acme.json` (prod only) |
| `APP_KEYS` | Comma-separated Strapi app keys (generate with `openssl rand -base64 32`) |
| `API_TOKEN_SALT` | Salt for Strapi API tokens |
| `ADMIN_JWT_SECRET` | Secret for Strapi admin JWTs |
| `JWT_SECRET` | Secret for Strapi user JWTs |
| `TRANSFER_TOKEN_SALT` | Salt for Strapi data transfer tokens |
| `STRAPI_NODE_ENV` | `development` or `production` |
| `DATABASE_CLIENT` | Always `postgres` |
| `DATABASE_USERNAME` | PostgreSQL username |
| `DATABASE_PASSWORD` | PostgreSQL password |
| `DATABASE_NAME` | PostgreSQL database name |
| `DATABASE_PORT` | PostgreSQL port (default `5432`) |
| `CMS_URL` | URL the frontend uses to reach Strapi (e.g. `http://strapi:1337` inside Docker) |
| `CMS_READ_ONLY_TOKEN` | Strapi read-only API token — generate in Strapi admin: **Settings > API Tokens** |
| `PREVIEW_SECRET` | Shared secret between Strapi and Next.js for draft preview mode |
| `ELASTIC_PASSWORD` | Elasticsearch password (used in prod; security is disabled in dev) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID — leave blank to disable |

Each sub-project also has its own `.env.example`:
- `cms/.env.example` — used when running Strapi outside Docker
- `next/.env.example` — used when running the frontend outside Docker

---

## Full-Stack Production Setup

Production runs all services (Traefik, Strapi, PostgreSQL, Elasticsearch, frontend) from pre-built images via `docker-compose.prod.yml`.

### Prerequisites
- Docker and Docker Compose installed on the server
- A domain pointed at the server (for Traefik + Let's Encrypt)
- An `acme.json` file created and permissions set:
  ```bash
  mkdir -p ./letsencrypt && touch ./letsencrypt/acme.json && chmod 600 ./letsencrypt/acme.json
  ```

### Steps

1. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env — set SITE_URL, EMAIL, DATABASE_PASSWORD, all secrets, ELASTIC_PASSWORD, etc.
   ```

2. **Start all services:**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

3. Services will be available at:
   - Frontend: `https://<SITE_URL>`
   - Strapi admin: `https://strapi.<SITE_URL>/admin`

4. **Import CMS data** (first-time setup):

   The production data snapshot is stored in the team Box folder — ask an admin for access. Once you have the file:
   ```bash
   # Run from the cms/ directory (or inside the strapi container)
   npm run strapi import -- -f ~/path/to/strapi-data.tar.gz
   ```

5. **Index content into Elasticsearch:**

   After importing data, run the indexing script so site search works. See [`scripts/elasticsearch/README.md`](scripts/elasticsearch/README.md) for setup and usage.

---

## Developer Guide

The dev workflow runs Strapi, PostgreSQL, and Elasticsearch in Docker while the Next.js frontend runs locally with hot reload.

### 1. Start the dev backend stack

```bash
cp .env.example .env
# Fill in DATABASE_PASSWORD and the Strapi secret values at minimum
# Leave CMS_URL=http://strapi:1337 (used by the frontend container if you uncomment it)

docker compose -f docker-compose.dev.yml up -d
```

This starts:
- **Strapi** at `http://localhost:1337` (admin at `http://localhost:1337/admin`)
- **PostgreSQL** at `localhost:5432`
- **Elasticsearch** at `http://localhost:9200` (no auth in dev)

The Strapi container mounts `./cms/src`, `./cms/config`, and `./cms/public/uploads` as live volumes, so local file changes are reflected immediately via Strapi's `develop` mode (hot reload).

### 2. Run the frontend locally

```bash
cd next
cp .env.example .env
# Set CMS_URL=http://localhost:1337
# Set ELASTICSEARCH_URL=http://localhost:9200
# Set CMS_READ_ONLY_TOKEN (generate in Strapi admin after first boot)
# Set PREVIEW_SECRET to match the value in your root .env

npm install
npm run dev
```

The frontend is now available at `http://localhost:3000`.

### 3. Making Strapi schema / content-type changes

Strapi content types and configuration live in `cms/src/api/` and `cms/config/`. Because these directories are volume-mounted into the running dev container, you can:

1. Edit files directly in `cms/src/api/<content-type>/` (schema, routes, controllers, services)
2. Strapi detects the change and rebuilds automatically (watch the `docker compose logs strapi` output)
3. Commit the changed files — schema changes are code and belong in version control

Content (actual data records) is managed through the Strapi admin UI at `http://localhost:1337/admin`.

### 4. Data export / import

```bash
# Export a snapshot (run from inside the cms/ directory or the strapi container)
npm run strapi export -- --file strapi-data-<date> --no-encrypt

# Import a snapshot
npm run strapi import -- -f ~/path/to/strapi-data-<date>.tar.gz
```

Snapshot files are stored in the team Box folder. Ask an admin for access.

### 5. Generating the CMS read-only API token

The frontend needs a Strapi API token to fetch content:

1. Open Strapi admin: `http://localhost:1337/admin`
2. Go to **Settings > API Tokens > Create new API Token**
3. Set type to **Read-only**, give it a name (e.g. `frontend-dev`)
4. Copy the generated token into `next/.env` as `CMS_READ_ONLY_TOKEN`

---

## Elasticsearch Search Indexing

After starting the backend stack or importing new content, run the indexing script to populate the search index. See [`scripts/elasticsearch/README.md`](scripts/elasticsearch/README.md) for setup and usage.
