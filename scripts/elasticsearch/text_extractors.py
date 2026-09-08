"""
Text extraction from Strapi dynamic zone components.

Each extractor function takes a component dict (from the Strapi API response)
and returns {"text": str, "headings": list[str]}.

"""

import requests
from bs4 import BeautifulSoup

from config import STRAPI_BASE_URL

# Cache for accordion group fetches to avoid duplicate API calls
_accordion_cache: dict[str, list] = {}

# --- Utility functions ---

def strip_html(html_string: str) -> str:
    """Strip HTML tags from CKEditor content, return plain text."""
    if not html_string:
        return ""
    return BeautifulSoup(html_string, "html.parser").get_text(separator=" ").strip()

# --- Component extractors ---


def extract_content_block(data: dict) -> dict:
    return {"text": strip_html(data.get("content", "")), "headings": []}

def extract_heading(data: dict) -> dict:
    text = data.get("headingText", "") or ""
    return {"text": text, "headings": [text] if text else []}

def extract_base_content_section(data: dict) -> dict:
    parts = [strip_html(data.get("textContent", ""))]
    pull_quote = data.get("pullQuote")
    if pull_quote:
        parts.append(strip_html(pull_quote.get("quoteText", "")))
    return {"text": " ".join(filter(None, parts)), "headings": []}



def extract_pullquote(data: dict) -> dict:
    return {"text": strip_html(data.get("quoteText", "")), "headings": []}

def extract_accordion(data: dict) -> dict:
    """Fetch accordion items via secondary API call and extract their content."""
    group_id = data.get("accordionGroupID", "")
    if not group_id:
        return {"text": "", "headings": []}

    # Check cache first
    if group_id not in _accordion_cache:
        try:
            resp = requests.get(
                f"{STRAPI_BASE_URL}/api/accordion-items",
                params={"filters[accordionGroup][$eq]": group_id},
                timeout=30,
            )
            resp.raise_for_status()
            _accordion_cache[group_id] = resp.json().get("data", [])
        except requests.RequestException as e:
            print(f"  Warning: Failed to fetch accordion group '{group_id}': {e}")
            return {"text": "", "headings": []}

    items = _accordion_cache[group_id]
    parts = []
    headings = []

    for item in items:
        title = item.get("title", "") or ""
        if title:
            parts.append(title)
            headings.append(title)

        # Recurse into accordion item's contents dynamic zone
        for component in item.get("contents", []):
            comp_type = component.get("__component", "")
            result = extract_component(comp_type, component)
            parts.append(result["text"])
            headings.extend(result.get("headings", []))

    return {"text": " ".join(filter(None, parts)), "headings": headings}


def extract_download_file(data: dict) -> dict:
    return {"text": data.get("displayText", "") or "", "headings": []}


def extract_full_span_image(data: dict) -> dict:
    return {"text": data.get("caption", "") or "", "headings": []}


def extract_image_with_pdf(data: dict) -> dict:
    parts = [
        data.get("caption", "") or "",
        data.get("infoText", "") or "",
    ]
    return {"text": " ".join(filter(None, parts)), "headings": []}


def extract_dual_map(data: dict) -> dict:
    parts = []
    for side in ("leftMap", "rightMap"):
        map_data = data.get(side)
        if map_data:
            result = extract_image_with_pdf(map_data)
            parts.append(result["text"])
    return {"text": " ".join(filter(None, parts)), "headings": []}


def extract_dual_view_image(data: dict) -> dict:
    return {"text": data.get("caption", "") or "", "headings": []}

def extract_chart_selector(data: dict) -> dict:
    """Extract text from chart relation (auto-populated by deep populate)."""
    chart = data.get("chart")
    if not chart:
        return {"text": "", "headings": []}
    parts = [
        chart.get("caption", "") or "",
        chart.get("infoText", "") or "",
        chart.get("ariaLabel", "") or "",
    ]
    return {"text": " ".join(filter(None, parts)), "headings": []}


def extract_chart_with_quote(data: dict) -> dict:
    parts = []
    headings = []

    # Extract from nested chart-selector
    chart_data = data.get("chart")
    if chart_data:
        result = extract_chart_selector(chart_data)
        parts.append(result["text"])

    # Extract from nested pullquote
    pull_quote = data.get("pullQuote")
    if pull_quote:
        parts.append(strip_html(pull_quote.get("quoteText", "")))

    return {"text": " ".join(filter(None, parts)), "headings": headings}


def extract_dual_chart(data: dict) -> dict:
    parts = []
    for side in ("leftChart", "rightChart"):
        chart_data = data.get(side)
        if chart_data:
            result = extract_chart_selector(chart_data)
            parts.append(result["text"])
    return {"text": " ".join(filter(None, parts)), "headings": []}


def extract_hero(data: dict) -> dict:
    parts = [
        strip_html(data.get("heroText", "")),
        data.get("buttonText", "") or "",
    ]
    return {"text": " ".join(filter(None, parts)), "headings": []}


def extract_info_block(data: dict) -> dict:
    parts = [strip_html(data.get("infoText", ""))]

    # Extract from custom-title component
    title = data.get("title")
    if title:
        parts.append(title.get("firstHalf", "") or "")
        parts.append(title.get("secondHalf", "") or "")

    # Extract from repeatable photoBlocks
    for block in data.get("photoBlocks", []) or []:
        parts.append(block.get("title", "") or "")

    return {"text": " ".join(filter(None, parts)), "headings": []}


def extract_stay_informed(data: dict) -> dict:
    parts = [data.get("subtitle", "") or ""]

    for link in data.get("links", []) or []:
        parts.append(link.get("text", "") or "")

    return {"text": " ".join(filter(None, parts)), "headings": []}


# --- Dispatcher ---

EXTRACTORS = {
    "content.content-block": extract_content_block,
    "content.heading": extract_heading,
    "content.base-content-section": extract_base_content_section,
    "content.pullquote": extract_pullquote,
    "content.accordion": extract_accordion,
    "content.download-file": extract_download_file,
    "content.full-span-image": extract_full_span_image,
    "content.image-with-pdf": extract_image_with_pdf,
    "content.dual-map": extract_dual_map,
    "content.dual-view-image": extract_dual_view_image,
    "content.chart-with-quote": extract_chart_with_quote,
    "charts.chart-selector": extract_chart_selector,
    "charts.dual-chart": extract_dual_chart,
    "home-page.hero": extract_hero,
    "home-page.info-block": extract_info_block,
    "home-page.stay-informed": extract_stay_informed,
}


def extract_component(comp_type: str, data: dict) -> dict:
    """Dispatch to the correct extractor based on __component type."""
    extractor = EXTRACTORS.get(comp_type)
    if extractor:
        return extractor(data)
    print(f"  Warning: No extractor for component type '{comp_type}'")
    return {"text": "", "headings": []}

def extract_from_page(page_data: dict) -> dict:
    """
    Walk the pageContents dynamic zone and extract all searchable text.
    Returns: {"all_text": str, "headings": str}
    """
    all_text_parts = []
    heading_parts = []

    for component in page_data.get("pageContents", []) or []:
        comp_type = component.get("__component", "")
        extracted = extract_component(comp_type, component)
        all_text_parts.append(extracted["text"])
        heading_parts.extend(extracted.get("headings", []))

    return {
        "all_text": " ".join(filter(None, all_text_parts)),
        "headings": " ".join(filter(None, heading_parts)),
    }
