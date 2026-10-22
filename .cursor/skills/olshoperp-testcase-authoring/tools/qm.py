import os, sys, json, subprocess
def key():
    for l in open(os.environ.get("OLSHOP_ENV_FILE", os.path.expanduser("~/Documents/GitHub/olshoperp/.env"))):
        if l.startswith("DB_DEBUG_API_KEY="): return l.split("=",1)[1].strip().strip('"').strip("'")
def q(db, sql, server="tyas"):
    url={"merdian":"https://n9n.olshoperp.com/webhook/agent-db-merdian","tyas":"https://n8n.olshoperp.com/webhook/agent-db-tyas"}[server]
    cfg='url = "%s"\nheader = "X-API-Key: %s"\nheader = "Content-Type: application/json"\n' % (url, key())
    r=subprocess.run(["curl","-sS","-K","-","--max-time","120","-d",json.dumps({"db":db,"query":sql})],input=cfg,capture_output=True,text=True)
    try: return json.loads(r.stdout)
    except Exception: return {"raw": r.stdout[:300], "err": r.stderr[:200]}
def show(t,sql,db="staging_olshoperp"):
    print("==",t); r=q(db,sql)
    if isinstance(r,list):
        for x in r: print(x)
        if not r: print("(kosong)")
    else: print(r)
