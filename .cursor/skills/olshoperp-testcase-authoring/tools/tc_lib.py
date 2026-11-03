"""Library: bangun card Jira Test Case (ADF) dari satu struktur data. Jira saja (tanpa dokumen TC di repo)."""
import json, os, re, subprocess, time
import socket, urllib.error, urllib.request

import tempfile
S = os.path.dirname(os.path.abspath(__file__))  # folder tools skill ini
# jira.sh = satu salinan kanonis di skill olshoperp-card-testing (jangan duplikat di sini)
JIRA_SH = os.path.normpath(os.path.join(S, "..", "..", "olshoperp-card-testing", "tools", "jira.sh"))
TMP = os.environ.get("OLSHOP_TMP", tempfile.gettempdir())
# Assignee TC: gantian Firda <-> Jeiniffer kecuali CFG["assignee"] (nama) diisi.
# CFG["assignee_start"] = nama pertama dalam rotasi (default Firda). accountId dicari via Jira user search.
QA_TESTERS = ["Firda", "Jeiniffer"]
_ACC = {}
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
    c += [head("Jejak & penanganan data uji"), bullets(cfg["cleanup"]), rule()]
    c += [head("Additional Context"),
          bullets([
              "test_type: " + tc["ttype"] + " · origin " + cfg["origin"],
              "Rujukan Expected: " + tc["req"],
              cfg["card_flow"],
          ])]
    return {"type": "doc", "version": 1, "content": c}


def jira(method, path, body=None, v="3"):
    args = [JIRA_SH, method, path]
    if body is not None:
        fn = os.path.join(TMP, "_jtc.json")
        open(fn, "w").write(json.dumps(body, ensure_ascii=False))
        args.append(fn)
    r = subprocess.run(args, capture_output=True, text=True, env=dict(os.environ, JV=v))
    return r.stdout.strip()


def account_id(name):
    if name not in _ACC:
        r = json.loads(jira("GET", "user/search?query=" + name) or "[]")
        if not r:
            raise SystemExit("assignee tidak ketemu di Jira: " + name)
        _ACC[name] = r[0]["accountId"]
    return _ACC[name]


def pick_assignee(tc, cfg):
    if cfg.get("assignee"):
        return cfg["assignee"]
    start = QA_TESTERS.index(cfg.get("assignee_start", QA_TESTERS[0]))
    return QA_TESTERS[(start + int(tc["n"]) - 1) % len(QA_TESTERS)]


_REQUEST_ID_RE = re.compile(r"^rec[A-Za-z0-9]+$")


def request_id_value(cfg):
    """Lark rec… atau literal 'none'. REQ-… / '-' / kosong ditolak (rule 12 HARD)."""
    raw = cfg.get("request_id")
    text = raw.strip() if isinstance(raw, str) else ""
    if text == "none" or _REQUEST_ID_RE.fullmatch(text):
        return text
    raise SystemExit(
        "request_id tidak valid: %r. "
        "Hanya Lark record ID (^rec[A-Za-z0-9]+$) atau literal 'none'. "
        "Dilarang: REQ-…, label notulen, '-', kosong, n/a. "
        "Definisi HARD: .cursor/rules/12-jira-card-format.mdc" % (raw,)
    )


def create_card(tc, cfg):
    request_id = request_id_value(cfg)
    body = {"fields": {
        "project": {"key": "ETM"}, "issuetype": {"id": "10051"},
        "summary": "[" + cfg["menu_label"] + "] - " + tc["title"],
        "description": description(tc, cfg),
        "priority": {"name": tc["priority"]},
        "labels": [cfg["origin"], "test-case", "test-type-" + tc["ttype"]] + (["need-data"] if tc.get("need_data") else []),
        "assignee": {"accountId": account_id(pick_assignee(tc, cfg))},
        "customfield_10429": cfg["menu_label"],
        "customfield_10495": request_id,
        "customfield_10043": 1,
    }}
    r = jira("POST", "issue", body)
    try:
        return json.loads(r)
    except Exception:
        return {"error": r[:600]}


def verify_created(key, request_id, menu):
    """GET field wajib rule 12. Request ID invalid atau Menu kosong/beda → PUT sekali, lalu cek lagi."""
    raw = jira("GET", "issue/%s?fields=customfield_10495,customfield_10429,customfield_10043,labels,assignee" % key)
    try:
        fields = json.loads(raw).get("fields") or {}
    except Exception:
        raise SystemExit("verifikasi create gagal untuk " + key + ": " + raw[:400])
    got = fields.get("customfield_10495")
    got_s = got.strip() if isinstance(got, str) else ""
    fix = {}
    if not (got_s and got_s != "-" and got_s == request_id):
        fix["customfield_10495"] = request_id
    if fields.get("customfield_10429") != menu:
        fix["customfield_10429"] = menu
    if not fix:
        return "ok"
    jira("PUT", "issue/" + key, {"fields": fix})
    time.sleep(2.5)
    raw2 = jira("GET", "issue/%s?fields=customfield_10495,customfield_10429" % key)
    try:
        fields2 = json.loads(raw2).get("fields") or {}
    except Exception:
        fields2 = {}
    got2 = fields2.get("customfield_10495")
    got2_s = got2.strip() if isinstance(got2, str) else ""
    if not got2_s or got2_s == "-" or got2_s != request_id:
        raise SystemExit("Request ID tetap tidak valid pada " + key + " setelah perbaiki: " + repr(got2)[:200])
    if fields2.get("customfield_10429") != menu:
        raise SystemExit("Menu tetap kosong/beda pada " + key + " setelah perbaiki: " + repr(fields2.get("customfield_10429"))[:200])
    return "fixed " + ", ".join(sorted(fix))


def link_card(new_key, cfg):
    return jira("POST", "issueLink", {"type": {"name": "Relates"}, "inwardIssue": {"key": new_key}, "outwardIssue": {"key": cfg["origin"]}}) or "ok"


def _env_value(name):
    """Nilai dari env proses atau .env (lokasi sama dengan jira.sh)."""
    val = os.environ.get(name, "").strip()
    env_file = os.environ.get("OLSHOP_ENV_FILE", os.path.expanduser("~/Documents/GitHub/olshoperp/.env"))
    if not val and os.path.exists(env_file):
        for line in open(env_file):
            if line.startswith(name + "="):
                val = line.split("=", 1)[1].strip().strip("'\"")
                break
    return val


def moira_url():
    """URL webhook Moira (penyiap data): env MOIRA_WEBHOOK_URL atau .env.
    Repo ini PUBLIK: JANGAN tulis URL atau token-nya di repo, komentar Jira, atau output."""
    return _env_value("MOIRA_WEBHOOK_URL")


def precondition_text(tc, cfg):
    """Isi section Precondition Data apa adanya (bullet + tabel data uji) sebagai teks."""
    lines = ["- " + t for t in cfg["pre_common"] + tc["pre"]]
    for title, header, rows in tc["data_tables"]:
        lines += ["", title, "| " + " | ".join(header) + " |"]
        lines += ["| " + " | ".join(str(c) for c in row) + " |" for row in rows]
    return "\n".join(lines)


def notify_moira(key, tc, cfg, event="created"):
    """Panggil webhook Moira untuk TC berlabel need-data. Tidak pernah raise; kembalikan teks status."""
    url = moira_url()
    if not url:
        return "TIDAK TERKIRIM: MOIRA_WEBHOOK_URL belum diset (env atau .env)"
    payload = {
        "key": key, "event": event, "origin": cfg["origin"],
        "summary": "[" + cfg["menu_label"] + "] - " + tc["title"],
        "menu": cfg["menu_label"], "precondition": precondition_text(tc, cfg),
    }
    headers = {"Content-Type": "application/json"}
    token = _env_value("MOIRA_WEBHOOK_TOKEN")
    if token:
        headers["Authorization"] = "Bearer " + token
    req = urllib.request.Request(
        url, data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return "terkirim HTTP %s" % resp.status
    except urllib.error.HTTPError as e:
        return "GAGAL HTTP %s" % e.code
    except (socket.timeout, TimeoutError):
        return "TIMEOUT: tidak pasti terkirim (workflow bisa saja sudah menerima). Cek eksekusi n8n / komentar Moira sebelum kirim ulang"
    except urllib.error.URLError as e:
        if isinstance(getattr(e, "reason", None), (socket.timeout, TimeoutError)):
            return "TIMEOUT: tidak pasti terkirim (workflow bisa saja sudah menerima). Cek eksekusi n8n / komentar Moira sebelum kirim ulang"
        return "GAGAL %s" % type(e).__name__
    except Exception as e:
        return "GAGAL %s" % type(e).__name__


def update_card(key, tc, cfg):
    fields = {"description": description(tc, cfg)}
    if tc.get("retitle"):
        fields["summary"] = "[" + cfg["menu_label"] + "] - " + tc["title"]
    return jira("PUT", "issue/" + key, {"fields": fields}) or "ok"


# ------------------------------------------------------------------ CLI
# python3 tc_lib.py <file_data.py> create|update|notify
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
            time.sleep(3)  # minimum antar create (rule 12); edit/link tetap 2.5
            print("  verify:", verify_created(r["key"], request_id_value(D.CFG), D.CFG["menu_label"]))
            time.sleep(2.5)
            print("  link:", link_card(r["key"], D.CFG))
            time.sleep(2.5)
            if tc.get("need_data"):
                print("  moira:", notify_moira(r["key"], tc, D.CFG))
                time.sleep(2.5)
    elif cmd == "notify":  # kirim ulang / susulan webhook Moira untuk TC need_data yang sudah terbit
        only = set(sys.argv[3:])  # opsional: nomor TC saja, mis. `notify 1` atau `notify 2 3`
        for tc in D.TCS:
            k = keys.get(str(tc["n"]))
            if tc.get("need_data") and k and (not only or str(tc["n"]) in only):
                status = notify_moira(k, tc, D.CFG)
                print(tc["n"], k, status)
                if not status.startswith("terkirim"):
                    print("Berhenti: kirim berikutnya ditahan sampai penyebabnya jelas (lihat SKILL.md §3B).")
                    break
                time.sleep(2.5)
    elif cmd == "update":
        for tc in D.TCS:
            print(tc["n"], keys[str(tc["n"])], update_card(keys[str(tc["n"])], tc, D.CFG)[:80])
            time.sleep(2.5)
