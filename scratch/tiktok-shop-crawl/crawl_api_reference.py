#!/usr/bin/env python3
"""
One-off crawler: TikTok Shop Partner Center API Reference → markdown.
Output: docs/supplementary-knowledge/tiktok-shop/
Source APIs (public doc endpoints, no login required for api_meta):
  - GET /api/v1/document/tree
  - GET /api/v1/document/api_meta?src_document_id=...
Markdown shape mirrors the site's "Download Markdown" button.
"""

from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.request
from collections import Counter
from pathlib import Path

AID = "359713"
LOCALE = "en-US"
BASE = "https://partner.tiktokshop.com/api/v1/document"
TREE_URL = f"{BASE}/tree?workspace_id=3&aid={AID}&locale={LOCALE}"
API_META_URL = f"{BASE}/api_meta?src_document_id={{doc_path}}&aid={AID}&locale={LOCALE}"
PAGE_URL = "https://partner.tiktokshop.com/docv2/page/{doc_path}"

REPO_ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = REPO_ROOT / "docs" / "supplementary-knowledge" / "tiktok-shop"
CACHE_DIR = Path(__file__).resolve().parent / "cache" / "api_meta"
DELAY = 0.25
MAX_RETRIES = 4

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://partner.tiktokshop.com/docv2/",
    "Origin": "https://partner.tiktokshop.com",
}

METHOD_MAP = {
    1: "POST",
    2: "GET",
    3: "PUT",
    4: "DELETE",
    5: "PATCH",
}


def safe_slug(name: str, max_len: int = 80) -> str:
    s = name.strip().lower()
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"[\s_]+", "-", s).strip("-")
    return (s or "untitled")[:max_len]


def fetch_json(url: str) -> dict | None:
    for attempt in range(1, MAX_RETRIES + 1):
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            if data.get("code") == 0:
                return data
            return None
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < MAX_RETRIES:
                time.sleep(2**attempt)
                continue
            return None
        except Exception:
            if attempt < MAX_RETRIES:
                time.sleep(2**attempt)
                continue
            return None
    return None


def cell(value) -> str:
    if value is None:
        return ""
    text = str(value).replace("\r\n", "\n").replace("\r", "\n")
    text = text.replace("|", "\\|").replace("\n", "<br>")
    return text


def param_rows(params: list | None, headers: list[str]) -> list[str]:
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join("---" for _ in headers) + " |",
    ]
    for p in params or []:
        if len(headers) == 4 and headers[2] in ("Required",):
            lines.append(
                "| {name} | {type} | {req} | {desc} |".format(
                    name=cell(p.get("name")),
                    type=cell(p.get("type")),
                    req=cell(p.get("required")),
                    desc=cell(p.get("desc")),
                )
            )
        else:
            # Response: Properties | Type | Sample | Properties description
            lines.append(
                "| {name} | {type} | {ex} | {desc} |".format(
                    name=cell(p.get("name")),
                    type=cell(p.get("type")),
                    ex=cell(p.get("example")),
                    desc=cell(p.get("desc")),
                )
            )
    return lines


def format_json_block(raw: str) -> str:
    raw = (raw or "").strip()
    if not raw:
        return ""
    try:
        return json.dumps(json.loads(raw), ensure_ascii=False, indent=2)
    except Exception:
        return raw


def method_label(meta: dict) -> str:
    m = meta.get("method")
    if m in METHOD_MAP:
        return METHOD_MAP[m]
    if meta.get("is_post_method"):
        return "POST"
    return str(m or "GET")


def to_markdown(meta: dict, leaf: dict) -> str:
    title = meta.get("title") or leaf["name"]
    scopes = meta.get("scope_list") or []
    scope_keys = ", ".join(
        s.get("scope_key") or s.get("package_name") or "" for s in scopes if s
    )
    path = meta.get("interface_path") or ""
    method = method_label(meta)
    env_desc = (meta.get("env_desc") or "").strip()

    parts: list[str] = [f"# {title}", ""]

    # Provenance header (extra vs official download — useful for OlshopERP docs)
    parts.extend(
        [
            f"> **Source:** [{PAGE_URL.format(doc_path=leaf['document_path'])}]"
            f"({PAGE_URL.format(doc_path=leaf['document_path'])})",
            f"> **Category:** {leaf['category']}",
            f"> **document_path:** `{leaf['document_path']}`",
            "",
        ]
    )

    if env_desc:
        parts.extend(["## Description", "", env_desc, ""])

    parts.extend(
        [
            "## Required scope",
            "",
            scope_keys or "_(none listed)_",
            "",
            "## Path",
            "",
            f"`{path}`" if path else "_(none)_",
            "",
            "## Method",
            "",
            f"`{method}`",
            "",
            "## Request Header",
            "",
        ]
    )
    parts.extend(
        param_rows(
            meta.get("request_header_param"),
            ["Properties", "Type", "Required", "Properties description"],
        )
    )
    parts.extend(["", "## Query Header", ""])
    parts.extend(
        param_rows(
            meta.get("request_query_param"),
            ["Properties", "Type", "Required", "Properties description"],
        )
    )
    parts.extend(["", "## Request Body", ""])
    body_params = meta.get("request_body_param") or meta.get("request_param")
    # Some metas only expose request_body as JSON string without param table
    if isinstance(body_params, list) and body_params:
        parts.extend(
            param_rows(
                body_params,
                ["Properties", "Type", "Required", "Properties description"],
            )
        )
    else:
        # Match official empty table when no body schema list
        parts.extend(
            [
                "| Properties | Type | Required | Properties description |",
                "| --- | --- | --- | --- |",
            ]
        )
        body_raw = format_json_block(meta.get("request_body") or "")
        if body_raw:
            parts.extend(["", "### Request Body Example", "", "```json", body_raw, "```"])

    parts.extend(["", "## Code Example", ""])
    for sample in meta.get("sample_code") or []:
        label = sample.get("label") or sample.get("key") or "Example"
        lang = sample.get("language") or ""
        code = (sample.get("value") or "").rstrip() + "\n"
        parts.extend([f"### {label}", "", f"```{lang}", code, "```", ""])

    parts.extend(["## Response Parameters", ""])
    parts.extend(
        param_rows(
            meta.get("response_param"),
            ["Properties", "Type", "Sample", "Properties description"],
        )
    )

    resp_body = format_json_block(meta.get("response_body") or "")
    if resp_body:
        parts.extend(["", "## Example", "", "```json", resp_body, "```", ""])

    parts.extend(["## Error Code", ""])
    err = meta.get("error_code_list") or meta.get("error_codes") or []
    # Prefer structured list if present; else empty table like official download
    if isinstance(err, list) and err and isinstance(err[0], dict):
        parts.extend(
            [
                "| Code | Message |",
                "| --- | --- |",
            ]
        )
        for e in err:
            parts.append(
                f"| {cell(e.get('code') or e.get('error_code'))} | {cell(e.get('message') or e.get('msg'))} |"
            )
    else:
        parts.extend(["| Code | Message |", "| --- | --- |"])

    parts.append("")
    return "\n".join(parts)


def build_leaves(nodes: list) -> list[dict]:
    by_id = {n["document_id"]: n for n in nodes}

    def ancestors(nid: str) -> list[str]:
        out = []
        cur = by_id.get(nid)
        while cur:
            out.append(cur.get("name") or "")
            cur = by_id.get(cur.get("parent_id") or "")
        return list(reversed(out))

    leaves = []
    for n in nodes:
        path = n.get("document_path") or ""
        if not path or n.get("is_dir"):
            continue
        anc = ancestors(n["document_id"])
        if "API Reference" not in anc:
            continue
        category = next(
            (a for a in anc if a not in ("API Reference", n.get("name"))),
            "uncategorized",
        )
        leaves.append(
            {
                "name": n.get("name") or path,
                "document_path": path,
                "document_id": n.get("document_id"),
                "ancestors": anc,
                "category": category,
                "update_time": n.get("update_time"),
            }
        )
    return leaves


def main() -> None:
    print("Fetching document tree…")
    tree = fetch_json(TREE_URL)
    if not tree:
        raise SystemExit("Failed to fetch document tree")

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "_meta").mkdir(parents=True, exist_ok=True)

    raw_path = OUT_DIR / "_meta" / "document-tree.json"
    raw_path.write_text(json.dumps(tree, ensure_ascii=False, indent=2), encoding="utf-8")

    leaves = build_leaves(tree["data"]["document_tree"])
    print(f"API Reference leaves: {len(leaves)}")

    index = []
    ok = fail = skip = 0

    for i, leaf in enumerate(leaves, 1):
        cat_slug = safe_slug(leaf["category"])
        file_stem = leaf["document_path"]
        # Prefer document_path as filename (stable); sanitize
        file_stem = re.sub(r"[^\w.-]+", "-", file_stem).strip("-") or safe_slug(leaf["name"])
        out_file = OUT_DIR / cat_slug / f"{file_stem}.md"
        cache_file = CACHE_DIR / f"{file_stem}.json"

        print(f"[{i}/{len(leaves)}] {leaf['category']} / {leaf['name']} …", end="", flush=True)

        meta_wrap = None
        if cache_file.exists():
            try:
                meta_wrap = json.loads(cache_file.read_text(encoding="utf-8"))
            except Exception:
                meta_wrap = None

        if not meta_wrap:
            time.sleep(DELAY)
            data = fetch_json(API_META_URL.format(doc_path=leaf["document_path"]))
            if not data or not data.get("data"):
                print(" FAIL")
                fail += 1
                continue
            meta_wrap = data
            cache_file.write_text(
                json.dumps(meta_wrap, ensure_ascii=False, indent=2), encoding="utf-8"
            )
        else:
            skip += 1  # cache hit for meta; still (re)write md

        meta = meta_wrap["data"]["document_api_meta"]
        md = to_markdown(meta, leaf)
        out_file.parent.mkdir(parents=True, exist_ok=True)
        out_file.write_text(md, encoding="utf-8")
        ok += 1
        print(" OK")

        index.append(
            {
                "title": meta.get("title") or leaf["name"],
                "category": leaf["category"],
                "method": method_label(meta),
                "path": meta.get("interface_path"),
                "document_path": leaf["document_path"],
                "file": str(out_file.relative_to(OUT_DIR)),
                "scope": [
                    s.get("scope_key")
                    for s in (meta.get("scope_list") or [])
                    if s.get("scope_key")
                ],
                "source_url": PAGE_URL.format(doc_path=leaf["document_path"]),
            }
        )

    index.sort(key=lambda x: (x["category"], x["title"]))
    (OUT_DIR / "_meta" / "api-index.json").write_text(
        json.dumps(
            {
                "source": "https://partner.tiktokshop.com/docv2/",
                "section": "API Reference",
                "crawled_endpoint_count": len(index),
                "endpoints": index,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    # Per-category README + root README
    by_cat: dict[str, list] = {}
    for item in index:
        by_cat.setdefault(item["category"], []).append(item)

    for cat, items in sorted(by_cat.items()):
        cat_slug = safe_slug(cat)
        lines = [
            f"# TikTok Shop API — {cat}",
            "",
            f"Snapshot dari [API Reference](https://partner.tiktokshop.com/docv2/) · {len(items)} endpoint.",
            "",
            "| Method | Endpoint | File |",
            "| --- | --- | --- |",
        ]
        for it in items:
            lines.append(
                f"| `{it['method']}` | `{it['path'] or '—'}` | [{it['title']}](./{Path(it['file']).name}) |"
            )
        lines.append("")
        (OUT_DIR / cat_slug / "README.md").write_text("\n".join(lines), encoding="utf-8")

    cat_counts = Counter(i["category"] for i in index)
    root_lines = [
        "# TikTok Shop Partner API — API Reference (snapshot)",
        "",
        "> **Status:** Referensi teknis eksternal (suplemen OlshopERP)  ",
        "> **Sumber:** [TikTok Shop Partner Center — API Reference](https://partner.tiktokshop.com/docv2/)  ",
        "> **Cakupan:** seluruh halaman **API Reference** (bukan Partner Guide / Developer Guide / Webhooks tab)  ",
        f"> **Jumlah endpoint:** {len(index)}  ",
        "> **Format:** Markdown setara tombol *Download Markdown* di situs resmi (+ header sumber)",
        "",
        "## Indeks per kategori",
        "",
        "| Kategori | Endpoint | Folder |",
        "| --- | ---: | --- |",
    ]
    for cat, count in sorted(cat_counts.items(), key=lambda x: (-x[1], x[0])):
        slug = safe_slug(cat)
        root_lines.append(f"| {cat} | {count} | [{slug}/](./{slug}/) |")
    root_lines.extend(
        [
            "",
            "## Metadata crawl",
            "",
            "- [`_meta/api-index.json`](./_meta/api-index.json) — indeks mesin (path, scope, file lokal)",
            "- [`_meta/document-tree.json`](./_meta/document-tree.json) — tree mentah dari API dokumen TikTok",
            "",
            "## Catatan QA",
            "",
            "- Ini **bukan** requirement OlshopERP; jangan dipakai sebagai AS-IS perilaku menu ERP.",
            "- Signature, `shop_cipher`, dan token mengikuti Developer Guide resmi TikTok Shop.",
            "- Snapshot bisa tertinggal dari docs live — cek Changelog di Partner Center bila ragu.",
            "",
        ]
    )
    (OUT_DIR / "README.md").write_text("\n".join(root_lines), encoding="utf-8")

    print("\nDone.")
    print(f"  wrote/ok : {ok}")
    print(f"  cache hit: {skip}")
    print(f"  failed   : {fail}")
    print(f"  output   : {OUT_DIR}")


if __name__ == "__main__":
    main()
