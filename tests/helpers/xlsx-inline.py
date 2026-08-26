#!/usr/bin/env python3
"""Minimal xlsx read/write (stdlib only) for Playwright import fixtures."""
from __future__ import annotations

import json
import sys
import zipfile
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
NS_M = NS["m"]

CONTENT_TYPES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>"""

RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>"""

WB = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets>
</workbook>"""

WB_RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>"""


def col_name(n: int) -> str:
    s = ""
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


def write_xlsx(path: str, headers: list[str], rows: list[list[str]]) -> None:
    sheet_rows = [headers, *rows]
    parts = []
    for r_idx, row in enumerate(sheet_rows, start=1):
        cells = []
        for c_idx, value in enumerate(row, start=1):
            ref = f"{col_name(c_idx)}{r_idx}"
            text = escape("" if value is None else str(value))
            cells.append(
                f'<c r="{ref}" t="inlineStr"><is><t xml:space="preserve">{text}</t></is></c>'
            )
        parts.append(f'<row r="{r_idx}">{"".join(cells)}</row>')
    sheet = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        f'<sheetData>{"".join(parts)}</sheetData></worksheet>'
    )
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", CONTENT_TYPES)
        zf.writestr("_rels/.rels", RELS)
        zf.writestr("xl/workbook.xml", WB)
        zf.writestr("xl/_rels/workbook.xml.rels", WB_RELS)
        zf.writestr("xl/worksheets/sheet1.xml", sheet)


def _shared_strings(zf: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in zf.namelist():
        return []
    root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    out: list[str] = []
    for si in root.findall("m:si", NS):
        texts = [
            (t.text or "")
            for t in si.iter(f"{{{NS_M}}}t")
        ]
        out.append("".join(texts))
    return out


def _cell_text(cell: ET.Element, strings: list[str]) -> str:
    cell_type = cell.attrib.get("t")
    if cell_type == "s":
        v = cell.find("m:v", NS)
        if v is None or v.text is None:
            return ""
        idx = int(v.text)
        return strings[idx] if 0 <= idx < len(strings) else ""
    if cell_type == "inlineStr":
        texts = [
            (t.text or "")
            for t in cell.iter(f"{{{NS_M}}}t")
        ]
        return "".join(texts)
    v = cell.find("m:v", NS)
    return v.text if v is not None and v.text else ""


def read_headers(path: str) -> list[str]:
    with zipfile.ZipFile(path) as zf:
        strings = _shared_strings(zf)
        sheet_name = next(
            name
            for name in zf.namelist()
            if name.startswith("xl/worksheets/sheet") and name.endswith(".xml")
        )
        root = ET.fromstring(zf.read(sheet_name))
        first_row = root.find("m:sheetData/m:row", NS)
        if first_row is None:
            return []
        headers: list[str] = []
        for cell in first_row.findall("m:c", NS):
            headers.append(_cell_text(cell, strings).strip())
        return headers


def main() -> int:
    if len(sys.argv) < 3:
        print("usage: xlsx-inline.py headers <file.xlsx> | write <out.xlsx> <json>", file=sys.stderr)
        return 2
    cmd = sys.argv[1]
    if cmd == "headers":
        print(json.dumps(read_headers(sys.argv[2]), ensure_ascii=False))
        return 0
    if cmd == "write":
        payload = json.loads(sys.argv[3])
        write_xlsx(sys.argv[2], payload["headers"], payload["rows"])
        return 0
    print(f"unknown command: {cmd}", file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
