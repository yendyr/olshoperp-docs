#!/usr/bin/env python3
"""Regenerate thin qa-docs lookup indexes for agent Q&A.

Source of truth for *which menus exist* remains ``manifest.yaml``.
This script only builds greppable alias/route indexes so agents do not
need to read the fat manifest for everyday Q&A.

Repo layout (olshoperp-docs): ``qa-docs/`` at repo root — not ``docs/qa-docs/``.

Usage (from repo root or any cwd):

    python3 qa-docs/_meta/generate-lookup.py
    python3 qa-docs/_meta/generate-lookup.py --check

Writes (do not hand-edit):

    qa-docs/_meta/lookup.tsv
    qa-docs/_meta/alias-index.yaml
"""

from __future__ import annotations

import argparse
import hashlib
import re
import sys
from collections import defaultdict
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.stderr.write(
        "PyYAML is required. Install with: python3 -m pip install pyyaml\n"
    )
    raise SystemExit(2)

META_DIR = Path(__file__).resolve().parent
QA_DOCS = META_DIR.parent
REPO_ROOT = QA_DOCS.parent

MANIFEST_PATH = META_DIR / "manifest.yaml"
OVERRIDES_PATH = META_DIR / "lookup-overrides.yaml"
LOOKUP_TSV = META_DIR / "lookup.tsv"
ALIAS_INDEX = META_DIR / "alias-index.yaml"

LAYER_FILES = (
    "knowledge-base.md",
    "requirement.md",
    "technical.md",
    "user-guide.md",
    "feature-map.md",
)

SKIP_DIR_NAMES = {
    "test-cases",
    "_legacy",
    "_meta",
    "flows",
    "capabilities",
    "results",
    "docs-hub",
}
SKIP_DIR_PREFIXES = ("ETM-",)

MODULE_PREFIXES = (
    "accounting-",
    "supplychain-",
    "omni-",
    "generalsetting-",
    "gate-",
)

DISPLAY_PREFIXES = (
    "dev - ",
    "beta - ",
    "dev-",
    "beta-",
)

TSV_COLUMNS = (
    "alias",
    "slug",
    "menu_name",
    "module",
    "source",
    "routes",
    "kb",
    "req",
    "tech",
    "ug",
    "also",
    "readme",
)

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)


def source_fingerprint() -> str:
    """Stable hash of inputs so generated files are deterministic."""
    h = hashlib.sha256()
    for path in (MANIFEST_PATH, OVERRIDES_PATH):
        h.update(path.name.encode())
        h.update(b"\0")
        h.update(path.read_bytes() if path.exists() else b"")
        h.update(b"\0")
    for slug_dir in sorted(p for p in QA_DOCS.iterdir() if p.is_dir()):
        for name in LAYER_FILES:
            doc = slug_dir / name
            if not doc.is_file():
                continue
            h.update(str(doc.relative_to(QA_DOCS)).encode())
            h.update(b"\0")
            fm = parse_frontmatter(doc)
            aliases = fm.get("aliases") or []
            h.update(repr(aliases).encode())
            h.update(b"\0")
    return h.hexdigest()[:12]


def norm_alias(raw: str) -> str:
    text = str(raw or "").strip().lower()
    text = text.replace("_", " ")
    text = re.sub(r"\s+", " ", text)
    text = text.strip(".,;:()[]{}\"'")
    return text


def strip_display_prefix(name: str) -> str:
    lowered = name.strip()
    check = lowered.lower()
    for prefix in DISPLAY_PREFIXES:
        if check.startswith(prefix):
            return lowered[len(prefix) :].strip()
    return lowered


def load_yaml(path: Path):
    if not path.exists():
        return {}
    with path.open(encoding="utf-8") as fh:
        data = yaml.safe_load(fh) or {}
    return data


def parse_frontmatter(path: Path) -> dict:
    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        return {}
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}
    try:
        data = yaml.safe_load(match.group(1)) or {}
    except yaml.YAMLError:
        return {}
    return data if isinstance(data, dict) else {}


def collect_frontmatter_aliases(slug: str) -> list[tuple[str, str]]:
    """Return (alias, source_tag) from menu layer docs only — skip TC/ETM/legacy."""
    folder = QA_DOCS / slug
    if not folder.is_dir():
        return []
    found: list[tuple[str, str]] = []
    for name in LAYER_FILES:
        fm = parse_frontmatter(folder / name)
        aliases = fm.get("aliases") or []
        if isinstance(aliases, str):
            aliases = [aliases]
        if not isinstance(aliases, list):
            continue
        tag = f"frontmatter:{name}"
        for item in aliases:
            if item is None:
                continue
            found.append((str(item), tag))
    return found


def doc_status(docs: dict, key: str) -> str:
    block = (docs or {}).get(key) or {}
    if isinstance(block, dict):
        return str(block.get("status") or "")
    return ""


def auto_aliases(slug: str, menu_name: str, routes: list[str]) -> list[tuple[str, str]]:
    out: list[tuple[str, str]] = [(slug, "slug"), (slug.replace("-", " "), "slug_spaces")]
    if menu_name:
        out.append((menu_name, "menu_name"))
        stripped = strip_display_prefix(menu_name)
        if stripped and stripped != menu_name:
            out.append((stripped, "menu_name_stripped"))
    for prefix in MODULE_PREFIXES:
        if slug.startswith(prefix):
            rest = slug[len(prefix) :]
            if rest:
                out.append((rest, "slug_unprefixed"))
                out.append((rest.replace("-", " "), "slug_unprefixed"))
            break
    for route in routes:
        out.append((route, "route"))
        out.append(("/" + route.lstrip("/"), "route"))
        last = route.rstrip("/").split("/")[-1]
        if last and last != slug:
            out.append((last, "route_tail"))
            out.append((last.replace("-", " "), "route_tail"))
    return out


def load_overrides() -> dict:
    data = load_yaml(OVERRIDES_PATH)
    extra = data.get("extra_aliases") or {}
    collisions = data.get("collisions") or {}
    ignore = {norm_alias(x) for x in (data.get("ignore_aliases") or []) if norm_alias(x)}
    ignore_fm = {
        norm_alias(x)
        for x in (data.get("ignore_frontmatter_aliases") or [])
        if norm_alias(x)
    }
    return {
        "extra_aliases": extra if isinstance(extra, dict) else {},
        "collisions": collisions if isinstance(collisions, dict) else {},
        "ignore_aliases": ignore,
        "ignore_frontmatter_aliases": ignore_fm,
    }


def build_index() -> tuple[dict, list[str]]:
    warnings: list[str] = []
    manifest = load_yaml(MANIFEST_PATH)
    menus = manifest.get("menus") or {}
    if not isinstance(menus, dict) or not menus:
        raise SystemExit(f"No menus found in {MANIFEST_PATH}")

    overrides = load_overrides()
    ignore = overrides["ignore_aliases"]
    ignore_fm = overrides["ignore_frontmatter_aliases"]

    menu_rows: dict[str, dict] = {}
    # alias_norm -> list of {slug, source, raw}
    claimed: dict[str, list[dict]] = defaultdict(list)

    def add_claim(alias_raw: str, slug: str, source: str) -> None:
        key = norm_alias(alias_raw)
        if not key or key in ignore:
            return
        if len(key) < 2:
            return
        claimed[key].append({"slug": slug, "source": source, "raw": str(alias_raw).strip()})

    for slug, entry in menus.items():
        if not isinstance(entry, dict):
            warnings.append(f"skip non-dict manifest entry: {slug}")
            continue
        docs = entry.get("docs") or {}
        routes = [str(r).strip().lstrip("/") for r in (entry.get("menu_links") or []) if r]
        menu_name = str(entry.get("menu_name") or slug)
        module = str(entry.get("module") or "")
        path = str(entry.get("path") or slug)
        readme = f"qa-docs/{path}/README.md"
        menu_rows[slug] = {
            "slug": slug,
            "menu_name": menu_name,
            "module": module,
            "path": f"qa-docs/{path}",
            "readme": readme,
            "routes": routes,
            "short_description": str(entry.get("short_description") or ""),
            "docs": {
                "knowledge-base": doc_status(docs, "knowledge-base"),
                "requirement": doc_status(docs, "requirement"),
                "technical": doc_status(docs, "technical"),
                "user-guide": doc_status(docs, "user-guide"),
            },
        }

        for alias, source in auto_aliases(slug, menu_name, routes):
            add_claim(alias, slug, source)
        for alias, source in collect_frontmatter_aliases(slug):
            if norm_alias(alias) in ignore_fm:
                continue
            add_claim(alias, slug, source)

    for slug, extras in overrides["extra_aliases"].items():
        if slug not in menu_rows:
            warnings.append(f"override extra_aliases slug not in manifest: {slug}")
            continue
        if isinstance(extras, str):
            extras = [extras]
        if not isinstance(extras, list):
            continue
        for alias in extras:
            add_claim(alias, slug, "override")

    # Collision keys themselves must be searchable (invoice, inbound, payment, …)
    for key, override in overrides["collisions"].items():
        if not isinstance(override, dict):
            continue
        preferred = override.get("prefer")
        if preferred in menu_rows:
            add_claim(key, preferred, "collision_override")
        elif preferred:
            warnings.append(f"collision prefer not in manifest: {key} -> {preferred}")
        for also_slug in override.get("also") or []:
            if also_slug in menu_rows:
                add_claim(key, also_slug, "collision_override")
            else:
                warnings.append(f"collision also not in manifest: {key} -> {also_slug}")

    # Deduplicate claims per (alias, slug) keeping first source
    compact: dict[str, list[dict]] = {}
    for key, rows in claimed.items():
        seen_slugs = set()
        kept = []
        for row in rows:
            if row["slug"] in seen_slugs:
                continue
            seen_slugs.add(row["slug"])
            kept.append(row)
        compact[key] = kept

    alias_entries: dict[str, dict] = {}
    collisions_out: list[dict] = []

    for key in sorted(compact):
        rows = compact[key]
        slugs = [r["slug"] for r in rows]
        override = overrides["collisions"].get(key) or overrides["collisions"].get(
            rows[0]["raw"].lower()
        )
        preferred = None
        note = ""
        also: list[str] = []
        source = rows[0]["source"]

        if isinstance(override, dict):
            preferred = override.get("prefer")
            also = [str(x) for x in (override.get("also") or []) if x]
            note = str(override.get("note") or "")
            if preferred and preferred not in slugs:
                warnings.append(
                    f"collision prefer '{preferred}' for alias '{key}' is not a claimant "
                    f"(claimants={slugs})"
                )
                if preferred in menu_rows:
                    slugs.append(preferred)
            source = "collision_override"

        if len(slugs) == 1 and not preferred:
            preferred = slugs[0]
        elif preferred:
            pass
        else:
            # Stable default: exact menu_name match, else first slug alpha
            exact = [
                s
                for s in slugs
                if norm_alias(menu_rows[s]["menu_name"]) == key
                or norm_alias(strip_display_prefix(menu_rows[s]["menu_name"])) == key
            ]
            preferred = sorted(exact or slugs)[0]
            also = sorted(set(slugs) - {preferred})
            if also:
                source = "collision_auto"
                collisions_out.append(
                    {
                        "alias": key,
                        "preferred": preferred,
                        "slugs": sorted(set(slugs)),
                        "note": "Unresolved in lookup-overrides.yaml — preferred exact menu_name or first slug",
                    }
                )

        also = sorted(set(also) | (set(slugs) - {preferred}))
        menu = menu_rows[preferred]
        alias_entries[key] = {
            "slug": preferred,
            "menu_name": menu["menu_name"],
            "module": menu["module"],
            "source": source,
            "readme": menu["readme"],
        }
        if also:
            alias_entries[key]["also"] = also
        if note:
            alias_entries[key]["note"] = note

        if isinstance(override, dict) and (also or note):
            collisions_out.append(
                {
                    "alias": key,
                    "preferred": preferred,
                    "slugs": sorted(set([preferred] + also)),
                    "note": note,
                }
            )

    # Dedupe collision list by alias
    seen_c = set()
    collisions_unique = []
    for item in collisions_out:
        if item["alias"] in seen_c:
            continue
        seen_c.add(item["alias"])
        collisions_unique.append(item)

    payload = {
        "meta": {
            "source_fingerprint": source_fingerprint(),
            "generator": "qa-docs/_meta/generate-lookup.py",
            "qa_docs_root": "qa-docs",
            "manifest": "qa-docs/_meta/manifest.yaml",
            "overrides": "qa-docs/_meta/lookup-overrides.yaml",
            "protocol": "qa-docs/_meta/README-lookup.md",
            "menu_count": len(menu_rows),
            "alias_count": len(alias_entries),
            "collision_count": len(collisions_unique),
        },
        "menus": {slug: menu_rows[slug] for slug in sorted(menu_rows)},
        "aliases": alias_entries,
        "collisions": collisions_unique,
    }
    return payload, warnings


def render_tsv(payload: dict) -> str:
    menus = payload["menus"]
    lines = [
        "# GENERATED by qa-docs/_meta/generate-lookup.py — do not edit",
        "# regenerate: python3 qa-docs/_meta/generate-lookup.py",
        "# protocol: qa-docs/_meta/README-lookup.md",
        "# " + "\t".join(TSV_COLUMNS),
    ]
    for alias in sorted(payload["aliases"]):
        entry = payload["aliases"][alias]
        menu = menus[entry["slug"]]
        docs = menu["docs"]
        row = [
            alias,
            entry["slug"],
            menu["menu_name"],
            menu["module"],
            entry.get("source") or "",
            "|".join(menu["routes"]),
            docs.get("knowledge-base") or "",
            docs.get("requirement") or "",
            docs.get("technical") or "",
            docs.get("user-guide") or "",
            "|".join(entry.get("also") or []),
            menu["readme"],
        ]
        cleaned = [str(c).replace("\t", " ").replace("\n", " ") for c in row]
        lines.append("\t".join(cleaned))
    lines.append("")
    return "\n".join(lines)


def render_alias_index(payload: dict) -> str:
    header = (
        "# GENERATED by qa-docs/_meta/generate-lookup.py — do not edit\n"
        "# regenerate: python3 qa-docs/_meta/generate-lookup.py\n"
        "# Q&A protocol: qa-docs/_meta/README-lookup.md\n"
        "# Write-docs SoT remains qa-docs/_meta/manifest.yaml (do not rename slugs here).\n"
    )
    body = yaml.safe_dump(
        payload,
        sort_keys=False,
        allow_unicode=True,
        default_flow_style=False,
        width=120,
    )
    return header + body


def write_outputs(payload: dict) -> None:
    LOOKUP_TSV.write_text(render_tsv(payload), encoding="utf-8")
    ALIAS_INDEX.write_text(render_alias_index(payload), encoding="utf-8")


def check_outputs(payload: dict) -> int:
    expected_tsv = render_tsv(payload)
    expected_yaml = render_alias_index(payload)
    ok = True
    if LOOKUP_TSV.read_text(encoding="utf-8") != expected_tsv:
        sys.stderr.write(f"STALE {LOOKUP_TSV.relative_to(REPO_ROOT)}\n")
        ok = False
    if ALIAS_INDEX.read_text(encoding="utf-8") != expected_yaml:
        sys.stderr.write(f"STALE {ALIAS_INDEX.relative_to(REPO_ROOT)}\n")
        ok = False
    if ok:
        print("lookup indexes are up to date")
        return 0
    print("Run: python3 qa-docs/_meta/generate-lookup.py", file=sys.stderr)
    return 1


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="Exit 1 if generated files would change (CI / drift).",
    )
    args = parser.parse_args()

    payload, warnings = build_index()
    for warning in warnings:
        print(f"warning: {warning}", file=sys.stderr)

    if args.check:
        return check_outputs(payload)

    write_outputs(payload)
    meta = payload["meta"]
    print(
        f"Wrote {LOOKUP_TSV.relative_to(REPO_ROOT)} and "
        f"{ALIAS_INDEX.relative_to(REPO_ROOT)} — "
        f"{meta['menu_count']} menus, {meta['alias_count']} aliases, "
        f"{meta['collision_count']} collisions"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
