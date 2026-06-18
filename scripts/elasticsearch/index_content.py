#!/usr/bin/env python3
"""
Index Strapi CMS content into Elasticsearch.

Usage:
    python index_content.py

Environment variables:
    STRAPI_URL          - Strapi API base URL (default: http://localhost:1337)
    ELASTICSEARCH_URL   - Elasticsearch URL (default: http://localhost:9200)
    ELASTICSEARCH_USERNAME - Elasticsearch username (default: elastic)
    ELASTICSEARCH_PASSWORD - Elasticsearch password (default: "")
"""

from datetime import datetime, timezone

import requests
from elasticsearch import Elasticsearch

from config import STRAPI_BASE_URL, ELASTICSEARCH_URL, ELASTICSEARCH_USERNAME, ELASTICSEARCH_PASSWORD, INDEX_NAME, INDEX_MAPPING
from text_extractors import extract_from_page

def fetch_all_pages() -> list:
    """Fetch all pages from Strapi, handling pagination."""
    all_pages = []
    page = 1
    page_size = 100

    while True:
        resp = requests.get(
            f"{STRAPI_BASE_URL}/api/pages",
            params={
                "pagination[page]": page,
                "pagination[pageSize]": page_size,
            },
            timeout=60,
        )
        resp.raise_for_status()
        data = resp.json()

        pages = data.get("data", [])
        all_pages.extend(pages)

        pagination = data.get("meta", {}).get("pagination", {})
        total_pages = pagination.get("pageCount", 1)

        print(f"  Fetched page {page}/{total_pages} ({len(pages)} items)")

        if page >= total_pages:
            break
        page += 1

    return all_pages

def fetch_home() -> dict:
    """Fetch the home page content from Strapi."""
    resp = requests.get(f"{STRAPI_BASE_URL}/api/home", timeout=60)
    resp.raise_for_status()
    return resp.json().get("data", {})

def populate_elasticsearch():
    print(f"Connecting to Elasticsearch at {ELASTICSEARCH_URL}")
    es = Elasticsearch(
    ELASTICSEARCH_URL,
    basic_auth=(ELASTICSEARCH_USERNAME, ELASTICSEARCH_PASSWORD),
)

    # Verify connection
    info = es.info()
    print(f"  Connected to Elasticsearch {info['version']['number']}")

    # Recreate index
    if es.indices.exists(index=INDEX_NAME):
        print(f"Deleting existing index '{INDEX_NAME}'")
        es.indices.delete(index=INDEX_NAME)

    print(f"Creating index '{INDEX_NAME}'")
    es.indices.create(index=INDEX_NAME, body=INDEX_MAPPING)

    # Index pages
    print(f"\nFetching pages from {STRAPI_BASE_URL}/api/pages")
    pages = fetch_all_pages()
    print(f"  Total pages: {len(pages)}")

    indexed_count = 0
    for page in pages:
        title = page.get("title", "")
        slug = page.get("slug", "")
        page_group = page.get("pageGroup", "")

        print(f"\nProcessing: {title} ({page_group}/{slug})")

        extracted = extract_from_page(page)
        all_text = extracted["all_text"]

        doc = {
            "title": title,
            "slug": slug,
            "pageGroup": page_group,
            "urlPath": f"/{page_group}/{slug}",
            "contentType": "page",
            "searchableText": all_text,
            "headings": extracted["headings"],
            "excerpt": all_text[:300] if all_text else "",
            "lastIndexed": datetime.now(timezone.utc).isoformat(),
        }

        es.index(index=INDEX_NAME, id=f"page-{page_group}-{slug}", document=doc)
        indexed_count += 1
        print(f"  Indexed ({len(all_text)} chars of text)")

    # Index home page
    print(f"\nFetching home page from {STRAPI_BASE_URL}/api/home")
    home = fetch_home()

    if home:
        extracted = extract_from_page(home)
        all_text = extracted["all_text"]

        doc = {
            "title": "Home",
            "slug": "home",
            "pageGroup": "",
            "urlPath": "/",
            "contentType": "home",
            "searchableText": all_text,
            "headings": extracted["headings"],
            "excerpt": all_text[:300] if all_text else "",
            "lastIndexed": datetime.now(timezone.utc).isoformat(),
        }

        es.index(index=INDEX_NAME, id="home", document=doc)
        indexed_count += 1
        print(f"  Indexed home page ({len(all_text)} chars of text)")
    else:
        print("  Warning: No home page data found")

    # Refresh and report
    es.indices.refresh(index=INDEX_NAME)
    count = es.count(index=INDEX_NAME)["count"]
    print(f"\nDone. {count} documents indexed in '{INDEX_NAME}'.")


if __name__ == "__main__":
    populate_elasticsearch()
