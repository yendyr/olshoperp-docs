"""Library umum: bangun card Jira Test Case (ADF) + dokumen TC DRAFT dari satu struktur data.
Dipakai untuk Account Payment (ETM-16643) dan Account Receive (ETM-16644)."""
import json, os, re, subprocess, time

import tempfile
S = os.path.dirname(os.path.abspath(__file__))  # folder tools (jira.sh ada di sini)
TMP = os.environ.get("OLSHOP_TMP", tempfile.gettempdir())
DOCS = os.environ.get("OLSHOP_DOCS_ROOT", os.path.normpath(os.path.join(S, "..", "..", "..", "..", "qa-docs")))
YEMIMA = "70121:4ae91cca-e288-40ee-aed0-32b6050a1bc1"
JIRA = "https://erpintegration.atlassian.net/browse/"
URL_RE = re.compile(r"(https?://[^\s)]+)")


def node(text, bold=False, link=None):
    n = {"type": "text", "text": text}
    marks = []
    if bold:
        marks.append({"type": "strong"})
    if link:
        marks.append({"type": "link", "attrs": {"href": link}})
    if marks:
        n["marks"] = marks
    return n


def inline(text):
    out = []
    for i, part in enumerate(text.split("**")):
        if not part:
            continue
        bold = i % 2 == 1
        pos = 0
        for m in URL_RE.finditer(part):
            if m.start() > pos:
                out.append(node(part[pos:m.start()], bold))
            out.append(node(m.group(1), bold, link=m.group(1)))
            pos = m.end()
        if pos < len(part):
            out.append(node(part[pos:], bold))
    return out


def para(text):
    return {"type": "paragraph", "content": inline(text) or [{"type": "text", "text": " "}]}


def head(text):
    return {"type": "paragraph", "content": [node(text, True)]}


def rule():
    return {"type": "rule"}


def bullets(items):
    return {"type": "bulletList", "content": [{"type": "listItem", "content": [para(i)]} for i in items]}


def ordered(steps):
    items = []
    for text, subs in steps:
        content = [para(text)]
        if subs:
            content.append(bullets(subs))
        items.append({"type": "listItem", "content": content})
    return {"type": "orderedList", "attrs": {"order": 1}, "content": items}


def table(header, rows):
    def cell(kind, text):
        return {"type": kind, "attrs": {}, "content": [para(text)]}
    trs = [{"type": "tableRow", "content": [cell("tableHeader", h) for h in header]}]
    for r in rows:
        trs.append({"type": "tableRow", "content": [cell("tableCell", c) for c in r]})
    return {"type": "table", "attrs": {"isNumberColumnEnabled": False, "layout": "default"}, "content": trs}


def description(tc, cfg):
    c = [head("Summary"), para(tc["summary"]), rule()]
    c += [head("Environment"),
          bullets(["Menu/Fitur: " + tc["menu_hint"],
                   "Environment: Staging (https://staging.olshoperp.com), company " + cfg["company_label"],
                   "URL (retest): " + cfg["list_url"] + " (daftar) dan link dokumen/invoice/note di tabel data uji"]), rule()]
    c += [head("Precondition Data"), bullets(cfg["pre_common"] + tc["pre"])]
    for title, header, rows in tc["data_tables"]:
        c += [para("**" + title + "**"), table(header, rows)]
    c += [rule(), head("Steps to Reproduce"), ordered(tc["steps"]), rule()]
    c += [head("Expected Result"), bullets(tc["expected"]), rule()]
    c += [head("Catatan untuk penguji"), bullets(tc["notes"]), rule()]
    c += [head("Pembersihan data (akhir tes)"), bullets(cfg["cleanup"]), rule()]
    c += [head("Additional Context"),
          bullets(["test_type: " + tc["ttype"] + " · origin " + cfg["origin"] + " · requirement: " + tc["req"], cfg["card_flow"]])]
    return {"type": "doc", "version": 1, "content": c}


def jira(method, path, body=None, v="3"):
    args = [S + "/jira.sh", method, path]
    if body is not None:
        fn = os.path.join(TMP, "_jtc.json")
        open(fn, "w").write(json.dumps(body, ensure_ascii=False))
        args.append(fn)
    r = subprocess.run(args, capture_output=True, text=True, env=dict(os.environ, JV=v))
    return r.stdout.strip()


def create_card(tc, cfg):
    body = {"fields": {
        "project": {"key": "ETM"}, "issuetype": {"id": "10051"},
        "summary": "[" + cfg["menu_label"] + "] - " + tc["title"],
        "description": description(tc, cfg),
        "priority": {"name": tc["priority"]},
        "labels": [cfg["origin"], "test-case", "test-type-" + tc["ttype"]],
        "assignee": {"accountId": YEMIMA},
        "customfield_10429": cfg["menu_label"],
        "customfield_10495": cfg["request_id"],
        "customfield_10043": 1,
    }}
    r = jira("POST", "issue", body)
    try:
        return json.loads(r)
    except Exception:
        return {"error": r[:600]}


def link_card(new_key, cfg):
    return jira("POST", "issueLink", {"type": {"name": "Relates"}, "inwardIssue": {"key": new_key}, "outwardIssue": {"key": cfg["origin"]}}) or "ok"


def update_card(key, tc, cfg):
    fields = {"description": description(tc, cfg)}
    if tc.get("retitle"):
        fields["summary"] = "[" + cfg["menu_label"] + "] - " + tc["title"]
    return jira("PUT", "issue/" + key, {"fields": fields}) or "ok"


# ------------------------------------------------------------------ dokumen TC
def q(s):
    return s.replace("**", "").replace('"', "'").replace("\n", " ").replace("\\", "/")


def ts(cfg, n):
    return "20261021%06d" % (cfg["ts0"] + (n - 1) * 100) if cfg.get("day", "20261021") == "20261021" else cfg["day"] + "%06d" % (cfg["ts0"] + (n - 1) * 100)


def flat_steps(tc):
    out = []
    for text, subs in tc["steps"]:
        t = text
        if subs:
            t += " " + " ".join((s if s.startswith("Cek") else "Cek: " + s).rstrip(".") + "." for s in subs)
        out.append(t)
    return out


def md_table(header, rows):
    esc = lambda x: str(x).replace("|", "/")
    lines = ["| " + " | ".join(esc(h) for h in header) + " |", "|" + "|".join("---" for _ in header) + "|"]
    for r in rows:
        lines.append("| " + " | ".join(esc(c) for c in r) + " |")
    return "\n".join(lines)


def doc(tc, cfg, key):
    n = tc["n"]; t = ts(cfg, n)
    title = tc["title"] if tc["title"].startswith("Summary") else cfg["doc_prefix"] + tc["title"]
    fm = ["---", "doc_type: e2e-test-case", "tc_code: PENDING-" + t, "menu: " + cfg["slug"],
          'menu_name: "' + cfg["menu_label"] + '"', "test_type: " + tc["ttype"],
          'title: "' + q(title) + '"', 'summary: "' + q(tc["doc_summary"]) + '"',
          "status: draft", "owner: QA - Yemima", "last_updated: " + cfg["date"],
          'requirement_ref: "' + q("qa-docs/" + cfg["slug"] + "/" + tc["req"]) + '"',
          "automated: false", "automated_spec: null", "execution_company:",
          "  id: %d" % cfg["company_id"], "  code: " + cfg["company_code"], "related_menus:"]
    for m in cfg["related_menus"]:
        fm.append("  - " + m)
    fm.append("preconditions:")
    for p in cfg["pre_common"] + tc["pre"]:
        fm.append('  - "' + q(p) + '"')
    fm.append("test_data:")
    for tt, header, rows in tc["data_tables"]:
        for r in rows:
            fm.append('  - field: "' + q(tt.split(" (")[0] + " / " + r[0]) + '"')
            fm.append('    value: "' + q(" | ".join(x for x in r[1:] if x)) + '"')
    fm.append("steps:")
    for s in flat_steps(tc):
        fm.append('  - "' + q(s) + '"')
    fm.append("expected_result: |")
    for i, e in enumerate(tc["expected"], 1):
        fm.append("  %d. %s" % (i, e.replace("\n", " ")))
    fm += ["test_result:", "  status: not_run", "  started_at: null", "  finished_at: null", "  executed_by: null",
           "  environment: staging", "  log_summary: null", "  report_url: null",
           "test_data_used: []", "run_history: []", "origin_jira: " + cfg["origin"],
           "first_execution:", "  at: null", "  via: null", "  jira: null",
           "last_execution:", "  at: null", "  jira: null", "  status: not_run", "  via: null", "---"]
    body = ["", "# " + title, "",
            "Card: [%s](%s%s) (Test Case, %s) · card asal: [%s](%s%s) · TC terkait lama: %s" % (key, JIRA, key, tc["ttype"], cfg["origin"], JIRA, cfg["origin"], cfg["old_tcs"]),
            "", "## Retest cepat", ""]
    for i, (text, subs) in enumerate(tc["steps"][1:4], 1):
        body.append("%d. %s" % (i, text))
    body += ["", "## Data uji dari awal sampai akhir", "", "Prasyarat umum:"]
    for p in cfg["pre_common"] + tc["pre"]:
        body.append("- " + p)
    for tt, header, rows in tc["data_tables"]:
        body += ["", "**" + tt + "**", "", md_table(header, rows)]
    body += ["", "## Langkah dan hasil yang harus terlihat", ""]
    for i, (text, subs) in enumerate(tc["steps"], 1):
        body.append("%d. %s" % (i, text))
        for s in subs:
            body.append("   - " + s)
    body += ["", "## Hasil yang diharapkan", ""]
    for e in tc["expected"]:
        body.append("- " + e)
    body += ["", "## Catatan QA", ""]
    for x in tc["notes"]:
        body.append("- " + x)
    body += ["- Dokumen ini DRAFT (belum dijalankan). Hasil run dicatat di card %s." % key, "", "## Pembersihan data (akhir tes)", ""]
    for x in cfg["cleanup"]:
        body.append("- " + x)
    return "\n".join(fm + body) + "\n"


def write_docs(tcs, cfg, keys):
    folder = os.path.join(DOCS, cfg["slug"], "test-cases")
    os.makedirs(folder, exist_ok=True)
    rows = []
    for tc in tcs:
        fn = "TC-%s-DRAFT-%s.md" % (cfg["prefix"], ts(cfg, tc["n"]))
        open(os.path.join(folder, fn), "w").write(doc(tc, cfg, keys[str(tc["n"])]))
        rows.append("| PENDING-%s | %s (%s) | draft | ❌ | %s |" % (ts(cfg, tc["n"]), tc["title"] if tc["title"].startswith("Summary") else cfg["doc_prefix"] + tc["title"], keys[str(tc["n"])], cfg["date"]))
    readme = os.path.join(folder, "README.md")
    lines = open(readme).read().split("\n") if os.path.exists(readme) else ["# Test Cases — " + cfg["menu_label"], "", "| TC Code | Title | Status | Automated | Last Updated |", "|---------|-------|--------|-----------|-------------|"]
    codes = ["PENDING-" + ts(cfg, tc["n"]) for tc in tcs]
    lines = [l for l in lines if not any(l.startswith("| " + c) for c in codes)]
    last = max(i for i, l in enumerate(lines) if l.startswith("|"))
    lines[last + 1:last + 1] = rows
    open(readme, "w").write("\n".join(lines))
    return folder


# ------------------------------------------------------------------ CLI
# python3 tc_lib.py <file_data.py> create|update|docs
# file_data.py memuat CFG (dict), TCS (list), dan KEYS (dict n->key, diisi otomatis setelah create).
if __name__ == "__main__":
    import importlib.util, sys
    path, cmd = sys.argv[1], sys.argv[2]
    spec = importlib.util.spec_from_file_location("data", path)
    D = importlib.util.module_from_spec(spec); spec.loader.exec_module(D)
    keys_file = os.path.splitext(path)[0] + "_keys.json"
    keys = dict(getattr(D, "KEYS", {}))
    if os.path.exists(keys_file):
        keys.update(json.load(open(keys_file)))
    if cmd == "create":
        for tc in D.TCS:
            if str(tc["n"]) in keys:
                continue
            r = create_card(tc, D.CFG)
            print(tc["n"], r.get("key") or r)
            if not r.get("key"):
                break
            keys[str(tc["n"])] = r["key"]
            json.dump(keys, open(keys_file, "w"))
            time.sleep(2.5)
            print("  link:", link_card(r["key"], D.CFG))
            time.sleep(2.5)
    elif cmd == "update":
        for tc in D.TCS:
            print(tc["n"], keys[str(tc["n"])], update_card(keys[str(tc["n"])], tc, D.CFG)[:80])
            time.sleep(2.5)
    elif cmd == "docs":
        print(write_docs(D.TCS, D.CFG, keys))
