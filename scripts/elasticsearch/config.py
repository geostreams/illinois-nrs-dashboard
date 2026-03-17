import os

STRAPI_BASE_URL = os.environ.get("STRAPI_URL", "http://localhost:1337")
ELASTICSEARCH_URL = os.environ.get("ELASTICSEARCH_URL", "http://localhost:9200")
INDEX_NAME = "ilnlrs-content"

INDEX_MAPPING = {
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0,
    },
    "mappings": {
        "properties": {
            "title": {"type": "text", "analyzer": "english"},
            "slug": {"type": "keyword"},
            "pageGroup": {"type": "keyword"},
            "urlPath": {"type": "keyword"},
            "contentType": {"type": "keyword"},
            "searchableText": {"type": "text", "analyzer": "english"},
            "headings": {"type": "text", "analyzer": "english"},
            "excerpt": {"type": "text", "analyzer": "english"},
            "lastIndexed": {"type": "date"},
        }
    },
}
