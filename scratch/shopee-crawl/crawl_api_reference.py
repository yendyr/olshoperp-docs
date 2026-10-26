#!/usr/bin/env python3
"""
One-off crawler: Shopee Open Platform API Reference (v2) → markdown.
Sources:
  - GET /opservice/api/v1/doc/module/?version=2
  - GET /opservice/api/v1/doc/api/?version=2&api_name=...
  - GET /opservice/api/v1/developer_guide/detail?document_id=... (Overview type=2)
Output: docs/supplementary-knowledge/shopee-open/
"""

from __future__ import annotations

import html
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = REPO_ROOT / "docs" / "supplementary-knowledge" / "shopee-open"
CACHE_DIR = Path(__file__).resolve().parent / "cache"
MAX_WORKERS = 8

SPC_CDS = str(uuid.uuid4())
SPC_CDS_VER = "2"
BASE = "https://open.shopee.com/opservice/api/v1"
PAGE_API = "https://open.shopee.com/documents/v2/{api_name}?module={module_id}&type=1"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://open.shopee.com/",
}

METHOD_MAP = {1: "POST", 2: "GET", 3: "PUT", 4: "DELETE", 5: "PATCH"}


def safe_slug(name: str, max_len: int = 80) -> str:
    s = (name or "").strip().lower()
    s = s.replace(" ", "-")
    s = re.sub(r"[^a-z0-9_\-\.]", "", s)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return (s or "untitled")[:max_len]


def fetch_json(url: str, retries: int = 4) -> dict | None:
    for attempt in range(1, retries + 1):
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < retries:
                time.sleep(2**attempt)
                continue
            return None
        except Exception:
            if attempt < retries:
                time.sleep(2**attempt)
                continue
            return None
    return None


def html_to_text(raw: str | None) -> str:
    if not raw:
        return ""
    text = str(raw)
    text = re.sub(r"(?i)<br\s*/?>", "\n", text)
    text = re.sub(r"(?i)</p\s*>", "\n", text)
    text = re.sub(r"(?i)<p[^>]*>", "", text)
    text = re.sub(r"(?i)<li[^>]*>", "- ", text)
    text = re.sub(r"(?i)</li\s*>", "\n", text)
    # keep link targets roughly
    text = re.sub(
        r'(?i)<a\s+[^>]*href\s*=\s*["\']?\s*([^"\'>\s]+)\s*["\']?[^>]*>(.*?)</a>',
        lambda m: f"{html.unescape(re.sub('<[^>]+>', '', m.group(2))).strip()} ({m.group(1).strip()})",
        text,
        flags=re.S,
    )
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return text


def cell(value) -> str:
    text = html_to_text(value) if value is not None else ""
    return text.replace("|", "\\|").replace("\n", "<br>")


def parse_maybe_json(value):
    if value is None:
        return None
    if isinstance(value, (dict, list)):
        return value
    if isinstance(value, str):
        s = value.strip()
        if not s:
            return None
        try:
            return json.loads(s)
        except Exception:
            return value
    return value


def flatten_params(params: list | None, depth: int = 0) -> list[dict]:
    out = []
    for p in params or []:
        name = p.get("name") or ""
        prefix = "^" * depth
        row = {
            "name": f"{prefix}{name}" if depth else name,
            "type": p.get("type"),
            "required": p.get("required"),
            "sample": p.get("sample"),
            "description": p.get("description"),
        }
        out.append(row)
        children = p.get("children") or p.get("child") or []
        if children:
            out.extend(flatten_params(children, depth + 1))
    return out


def method_label(api: dict) -> str:
    m = api.get("method")
    if m in METHOD_MAP:
        return METHOD_MAP[m]
    # fallback from curl sample
    samples = parse_maybe_json(api.get("request_sample")) or []
    if isinstance(samples, list):
        for s in samples:
            val = (s.get("value") or "").upper()
            for verb in ("GET", "POST", "PUT", "DELETE", "PATCH"):
                if f"REQUEST {verb}" in val or f"-X {verb}" in val or f"'{verb} " in val:
                    return verb
    if api.get("is_get_method"):
        return "GET"
    return "POST"


def param_table(rows: list[dict], with_required: bool) -> list[str]:
    if with_required:
        headers = ["Name", "Type", "Required", "Sample", "Description"]
        lines = [
            "| " + " | ".join(headers) + " |",
            "| " + " | ".join("---" for _ in headers) + " |",
        ]
        for r in rows:
            lines.append(
                "| {n} | {t} | {req} | {s} | {d} |".format(
                    n=cell(r.get("name")),
                    t=cell(r.get("type")),
                    req=cell(r.get("required")),
                    s=cell(r.get("sample")),
                    d=cell(r.get("description")),
                )
            )
    else:
        headers = ["Name", "Type", "Sample", "Description"]
        lines = [
            "| " + " | ".join(headers) + " |",
            "| " + " | ".join("---" for _ in headers) + " |",
        ]
        for r in rows:
            lines.append(
                "| {n} | {t} | {s} | {d} |".format(
                    n=cell(r.get("name")),
                    t=cell(r.get("type")),
                    s=cell(r.get("sample")),
                    d=cell(r.get("description")),
                )
            )
    return lines


def lang_fence(label: str) -> str:
    m = {
        "curl": "bash",
        "php": "php",
        "java": "java",
        "python": "python",
        "go": "go",
        "json": "json",
        "javascript": "javascript",
        "nodejs": "javascript",
    }
    return m.get((label or "").lower(), "")


def to_markdown(api: dict) -> str:
    name = api.get("api_name") or "unknown"
    method = method_label(api)
    path = api.get("path") or ""
    url = api.get("url") or ""
    define = html_to_text(api.get("define"))
    module = api.get("module_name") or ""
    module_id = api.get("module_id")
    source = PAGE_API.format(api_name=name, module_id=module_id or "")

    parts = [
        f"# {name}",
        "",
        f"> **Source:** [{source}]({source})",
        f"> **Module:** {module}",
        f"> **API type:** {api.get('api_type') or '—'}",
        "",
    ]
    if define:
        parts.extend(["## Description", "", define, ""])

    parts.extend(
        [
            "## Method",
            "",
            f"`{method}`",
            "",
            "## Path",
            "",
            f"`{path}`" if path else "_(none)_",
            "",
            "## Request Address",
            "",
            f"`{url}`" if url else "_(none)_",
            "",
        ]
    )

    common = parse_maybe_json(api.get("common_params")) or []
    if isinstance(common, list) and common:
        parts.extend(["## Common Request Parameters", ""])
        parts.extend(param_table(common, with_required=False))
        parts.append("")

    params_obj = parse_maybe_json(api.get("params")) or {}
    if isinstance(params_obj, dict):
        req = flatten_params(params_obj.get("request_params") or [])
        resp = flatten_params(params_obj.get("response_params") or [])
    else:
        req, resp = [], []

    parts.extend(["## Request Parameters", ""])
    if req:
        parts.extend(param_table(req, with_required=True))
    else:
        parts.extend(
            [
                "| Name | Type | Required | Sample | Description |",
                "| --- | --- | --- | --- | --- |",
            ]
        )
    parts.append("")

    samples = parse_maybe_json(api.get("request_sample")) or []
    if isinstance(samples, list) and samples:
        parts.extend(["## Request Example", ""])
        for s in samples:
            label = s.get("type") or "Example"
            code = (s.get("value") or "").rstrip() + "\n"
            parts.extend([f"### {label}", "", f"```{lang_fence(label)}", code, "```", ""])

    parts.extend(["## Response Parameters", ""])
    if resp:
        parts.extend(param_table(resp, with_required=False))
    else:
        parts.extend(
            [
                "| Name | Type | Sample | Description |",
                "| --- | --- | --- | --- |",
            ]
        )
    parts.append("")

    resp_samples = parse_maybe_json(api.get("response_sample")) or []
    if isinstance(resp_samples, list) and resp_samples:
        parts.extend(["## Response Example", ""])
        for s in resp_samples:
            label = s.get("type") or "JSON"
            raw = (s.get("value") or "").strip()
            try:
                pretty = json.dumps(json.loads(raw), ensure_ascii=False, indent=2)
            except Exception:
                pretty = raw
            parts.extend([f"```{lang_fence(label) or 'json'}", pretty, "```", ""])

    errors = api.get("error_list") or []
    common_errors = api.get("common_error_list") or []
    parts.extend(["## Error Codes", ""])
    parts.extend(
        [
            "| Error | Description | Solution |",
            "| --- | --- | --- |",
        ]
    )
    for e in list(errors) + list(common_errors):
        if not isinstance(e, dict):
            continue
        parts.append(
            f"| {cell(e.get('name') or e.get('error'))} | {cell(e.get('description') or e.get('message'))} | {cell(e.get('solution'))} |"
        )
    parts.append("")

    err_ex = parse_maybe_json(api.get("error_example")) or []
    if isinstance(err_ex, list) and err_ex:
        parts.extend(["## Error Example", ""])
        for s in err_ex:
            raw = (s.get("value") or "").strip()
            try:
                pretty = json.dumps(json.loads(raw), ensure_ascii=False, indent=2)
            except Exception:
                pretty = raw
            parts.extend(["```json", pretty, "```", ""])

    perms = api.get("api_permission") or []
    if perms:
        parts.extend(["## API Permissions", ""])
        for p in perms:
            parts.append(f"- {p}")
        parts.append("")

    logs = api.get("update_log_list") or []
    if logs:
        parts.extend(["## Update Log", "", "| Date | Content |", "| --- | --- |"])
        for log in logs:
            parts.append(f"| {cell(log.get('date'))} | {cell(log.get('content'))} |")
        parts.append("")

    return "\n".join(parts)


def fetch_api_detail(api_name: str) -> dict | None:
    qs = urllib.parse.urlencode(
        {
            "SPC_CDS": SPC_CDS,
            "SPC_CDS_VER": SPC_CDS_VER,
            "version": "2",
            "api_name": api_name,
        }
    )
    url = f"{BASE}/doc/api/?{qs}"
    cache = CACHE_DIR / "api" / f"{safe_slug(api_name)}.json"
    if cache.exists():
        try:
            return json.loads(cache.read_text(encoding="utf-8"))
        except Exception:
            pass
    data = fetch_json(url)
    if data and data.get("api_name"):
        cache.parent.mkdir(parents=True, exist_ok=True)
        cache.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        return data
    return None


def fetch_overview_guides() -> list[dict]:
    """Best-effort: map Overview TOC (type=2) via developer_guide list/detail."""
    qs = urllib.parse.urlencode(
        {"SPC_CDS": SPC_CDS, "SPC_CDS_VER": SPC_CDS_VER, "language_code": "en"}
    )
    listing = fetch_json(f"{BASE}/developer_guide/list?{qs}")
    if not listing:
        return []
    docs = []

    def walk(items, trail):
        for item in items or []:
            name = item.get("item_name") or "untitled"
            itype = item.get("item_type")
            if itype == 1 and item.get("children"):
                walk(item["children"], trail + [name])
            elif itype == 2:
                docs.append(
                    {
                        "document_id": item.get("item_id"),
                        "name": name,
                        "trail": trail,
                    }
                )

    walk(listing.get("developer_guide_list") or [], [])
    return docs


def fetch_guide_detail(document_id: int) -> dict | None:
    qs = urllib.parse.urlencode(
        {
            "SPC_CDS": SPC_CDS,
            "SPC_CDS_VER": SPC_CDS_VER,
            "document_id": document_id,
            "language_code": "en",
        }
    )
    cache = CACHE_DIR / "guides" / f"{document_id}.json"
    if cache.exists():
        try:
            return json.loads(cache.read_text(encoding="utf-8"))
        except Exception:
            pass
    data = fetch_json(f"{BASE}/developer_guide/detail?{qs}")
    if data:
        cache.parent.mkdir(parents=True, exist_ok=True)
        cache.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return data


def guide_to_markdown(meta: dict, detail: dict) -> str:
    title = (
        (detail.get("document") or {}).get("title")
        or detail.get("title")
        or meta["name"]
    )
    body = (
        (detail.get("document") or {}).get("content")
        or detail.get("content")
        or detail.get("document_content")
        or ""
    )
    source = f"https://open.shopee.com/developer-guide/{meta['document_id']}"
    trail = " / ".join(meta.get("trail") or [])
    parts = [
        f"# {title}",
        "",
        f"> **Source:** [{source}]({source})",
        f"> **Type:** Developer Guide / Overview",
        f"> **document_id:** `{meta['document_id']}`",
    ]
    if trail:
        parts.append(f"> **Section:** {trail}")
    parts.append("")
    if isinstance(body, str) and body.strip():
        # guides often HTML
        if "<" in body and ">" in body:
            parts.extend(["## Content", "", html_to_text(body), ""])
            parts.extend(["## Content (raw HTML)", "", "```html", body.strip(), "```", ""])
        else:
            parts.extend([body.strip(), ""])
    else:
        parts.extend(
            [
                "## Raw payload",
                "",
                "```json",
                json.dumps(detail, ensure_ascii=False, indent=2)[:50000],
                "```",
                "",
            ]
        )
    return "\n".join(parts)


def main() -> None:
    print(f"SPC_CDS={SPC_CDS}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "_meta").mkdir(parents=True, exist_ok=True)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)

    qs = urllib.parse.urlencode(
        {"version": "2", "SPC_CDS": SPC_CDS, "SPC_CDS_VER": SPC_CDS_VER}
    )
    print("Fetching module list…")
    modules_payload = fetch_json(f"{BASE}/doc/module/?{qs}")
    if not modules_payload or "modules" not in modules_payload:
        raise SystemExit("Failed to fetch module list")
    (OUT_DIR / "_meta" / "modules.json").write_text(
        json.dumps(modules_payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    modules = modules_payload["modules"]
    api_jobs = []
    for mod in modules:
        for item in mod.get("items") or []:
            if item.get("type") == 1:
                api_jobs.append(
                    {
                        "api_name": item["name"],
                        "module_name": mod.get("module_name"),
                        "module_id": mod.get("module_id") or item.get("module_id"),
                        "item_id": item.get("id"),
                    }
                )

    print(f"API endpoints (type=1): {len(api_jobs)}")

    index = []
    ok = fail = 0

    def work(job):
        detail = fetch_api_detail(job["api_name"])
        return job, detail

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futures = [ex.submit(work, j) for j in api_jobs]
        for i, fut in enumerate(as_completed(futures), 1):
            job, detail = fut.result()
            name = job["api_name"]
            print(f"[{i}/{len(api_jobs)}] {job['module_name']} / {name} …", end="", flush=True)
            if not detail:
                print(" FAIL")
                fail += 1
                continue
            # ensure module fields present
            detail.setdefault("module_name", job["module_name"])
            detail.setdefault("module_id", job.get("module_id") or detail.get("module_id"))
            md = to_markdown(detail)
            cat = safe_slug(detail.get("module_name") or job["module_name"] or "misc")
            out = OUT_DIR / cat / f"{safe_slug(name)}.md"
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(md, encoding="utf-8")
            ok += 1
            print(" OK")
            index.append(
                {
                    "api_name": name,
                    "title": name,
                    "module": detail.get("module_name") or job["module_name"],
                    "method": method_label(detail),
                    "path": detail.get("path"),
                    "url": detail.get("url"),
                    "file": str(out.relative_to(OUT_DIR)),
                    "source_url": PAGE_API.format(
                        api_name=name, module_id=detail.get("module_id") or ""
                    ),
                    "permissions": detail.get("api_permission") or [],
                }
            )

    # Overview / developer guides (supplement)
    print("\nFetching developer guides (overview)…")
    guide_metas = fetch_overview_guides()
    guide_index = []
    g_ok = g_fail = 0
    for meta in guide_metas:
        detail = fetch_guide_detail(meta["document_id"])
        if not detail:
            g_fail += 1
            continue
        md = guide_to_markdown(meta, detail)
        folder = safe_slug((meta.get("trail") or ["overview"])[0] if meta.get("trail") else "overview")
        out = OUT_DIR / "_guides" / folder / f"{meta['document_id']}-{safe_slug(meta['name'])}.md"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(md, encoding="utf-8")
        g_ok += 1
        guide_index.append(
            {
                "document_id": meta["document_id"],
                "title": meta["name"],
                "trail": meta.get("trail"),
                "file": str(out.relative_to(OUT_DIR)),
                "source_url": f"https://open.shopee.com/developer-guide/{meta['document_id']}",
            }
        )
        print(f"  guide {meta['document_id']} {meta['name']} OK")

    index.sort(key=lambda x: (x["module"], x["api_name"]))
    (OUT_DIR / "_meta" / "api-index.json").write_text(
        json.dumps(
            {
                "source": "https://open.shopee.com/documents/v2/",
                "version": "2",
                "crawled_endpoint_count": len(index),
                "guide_count": len(guide_index),
                "endpoints": index,
                "guides": guide_index,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    by_mod: dict[str, list] = {}
    for item in index:
        by_mod.setdefault(item["module"], []).append(item)

    for mod, items in sorted(by_mod.items()):
        slug = safe_slug(mod)
        lines = [
            f"# Shopee Open API — {mod}",
            "",
            f"Snapshot dari [Shopee Open Platform Documents v2](https://open.shopee.com/documents/v2/) · {len(items)} endpoint.",
            "",
            "| Method | Path | API |",
            "| --- | --- | --- |",
        ]
        for it in items:
            lines.append(
                f"| `{it['method']}` | `{it['path'] or '—'}` | [{it['api_name']}](./{Path(it['file']).name}) |"
            )
        lines.append("")
        (OUT_DIR / slug / "README.md").write_text("\n".join(lines), encoding="utf-8")

    counts = Counter(i["module"] for i in index)
    root = [
        "# Shopee Open Platform API — v2 Reference (snapshot)",
        "",
        "> **Status:** Referensi teknis eksternal (suplemen OlshopERP)  ",
        "> **Sumber:** [Shopee Open Platform — Documents v2](https://open.shopee.com/documents/v2/)  ",
        "> **Cakupan:** seluruh endpoint **API Reference** (type=1) + Developer Guides  ",
        f"> **Jumlah:** {len(index)} endpoint + {len(guide_index)} guide  ",
        "> **Format:** Markdown dari payload resmi `/opservice/api/v1/doc/api/`",
        "",
        "## Indeks per modul",
        "",
        "| Modul | Endpoint | Folder |",
        "| --- | ---: | --- |",
    ]
    for mod, count in sorted(counts.items(), key=lambda x: (-x[1], x[0])):
        slug = safe_slug(mod)
        root.append(f"| {mod} | {count} | [{slug}/](./{slug}/) |")
    root += [
        "",
        "## Developer Guides",
        "",
        f"Lihat [`_guides/`](./_guides/) ({len(guide_index)} dokumen).",
        "",
        "## Metadata crawl",
        "",
        "- [`_meta/api-index.json`](./_meta/api-index.json)",
        "- [`_meta/modules.json`](./_meta/modules.json)",
        "",
        "## Catatan QA",
        "",
        "- Ini **bukan** requirement OlshopERP; jangan dipakai sebagai AS-IS perilaku menu ERP.",
        "- Signing request: HMAC-SHA256 atas `partner_id`, path, `timestamp`, `access_token`, `shop_id`, `partner_key`.",
        "- Snapshot bisa tertinggal dari docs live — cek Announcement di Open Platform bila ragu.",
        "",
    ]
    (OUT_DIR / "README.md").write_text("\n".join(root), encoding="utf-8")

    print("\nDone.")
    print(f"  endpoints ok/fail : {ok}/{fail}")
    print(f"  guides ok/fail    : {g_ok}/{g_fail}")
    print(f"  output            : {OUT_DIR}")


if __name__ == "__main__":
    main()
