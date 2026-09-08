# Elasticsearch Content Indexer

Indexes Strapi CMS content into Elasticsearch so the site search works.

## Setup

### 1. Install dependencies

Using [uv](https://docs.astral.sh/uv/):

```bash
uv pip install -r requirements.txt
```

### 2. Create a `.env` file

Copy the example and fill in your values:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
```

You can also set `STRAPI_URL` if your Strapi instance is not running on the default `http://localhost:1337`.

| Variable                 | Default                  | Description                        |
|--------------------------|--------------------------|------------------------------------|
| `STRAPI_URL`             | `http://localhost:1337`  | Strapi API base URL                |
| `ELASTICSEARCH_URL`      | `http://localhost:9200`  | Elasticsearch URL                  |
| `ELASTICSEARCH_USERNAME` | `elastic`                | Elasticsearch username             |
| `ELASTICSEARCH_PASSWORD` | _(empty)_                | Elasticsearch password             |

## Running

Load the `.env` file and run the script:

```bash
set -a && source .env && set +a
python index_content.py
```

The script will:
1. Connect to Elasticsearch and recreate the `ilnlrs-content` index
2. Fetch all pages from Strapi and index their content
3. Fetch and index the home page
4. Print a summary of how many documents were indexed
