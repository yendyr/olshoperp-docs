---
doc_type: e2e-test-case
tc_code: TC-VAR-008
menu: supplychain-variant
menu_name: "Master Variant"
title: "Edit — hapus opsi random unused tidak di-re-inject"
summary: "Tag random bisa di-remove di Edit; setelah Save All opsi random tidak kembali jika unused."
status: draft
owner: QA - Yemima
last_updated: 2026-08-14
requirement_ref: "qa-docs/supplychain-variant/requirement.md"
automated: true
automated_spec: "tests/specs/variant/variant-fail-cases.spec.ts"
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login staging, company FAT (112)."
  - "Ada Variant Group Default OFF dengan opsi random + Red yang unused di product."
test_data:
  - field: "URL edit"
    value: "https://staging.olshoperp.com/supplychain/variant/edit/2965"
  - field: "Code"
    value: "NR9551"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/variant/edit/2965"
  - "Hapus tag **random** (ikon remove pada tag)."
  - "Klik **Save All**."
  - "Reload Edit — cek Option Name."
expected_result: |
  FE izinkan remove Random. Update tidak re-inject `random` jika user menghapus dan opsi unused (requirement §6.2 / §6.5).
test_result:
  status: fail
  started_at: "2026-08-14 06:18"
  finished_at: "2026-08-14 06:19"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    Tag random punya tombol remove (FE unlock OK). Setelah klik remove, UI tampil Red saja.
    Save All toast success. PUT /api/supplychain/variant/2965 body option=["Red"], is_default_variant=false.
    GET setelah save tetap variant_options random (is_random=1) + Red. Random kembali / tidak terhapus.
  report_url: null
test_data_used:
  - field: "URL edit"
    value: "https://staging.olshoperp.com/supplychain/variant/edit/2965"
  - field: "PUT payload option"
    value: "[\"Red\"]"
  - field: "GET options after save"
    value: "random, Red"
run_history:
  - at: "2026-08-14 06:19"
    status: fail
    note: "ETM-15511 — BE masih keep/re-inject random on update Default OFF"
origin_jira: ETM-15511
last_execution:
  at: "2026-08-14 06:19"
  jira: ETM-15511
---

# TC-VAR-008

## Catatan QA

AC card: *Edit unlock: FE izinkan remove Random; BE izinkan hapus is_random=1 jika unused & tidak di payload; update jangan re-inject jika user hapus.*

**Actual:** FE remove OK. BE PUT tanpa `random` tetap menyisakan opsi random di GET. Sesuai AS-IS lama (sync delete `is_random = 0`).
