---
doc_type: e2e-test-case
tc_code: TC-PI-APPROVE-001
menu: supplychain-new-purchase-inbound
menu_name: "Purchase Inbound"
title: "Approve dokumen inbound IN-6A506EAC dari halaman show — status Approved"
summary: "Buka show dari datalist, klik checklist biru Approve, verifikasi toast sukses, form read-only, dan status Approved di datalist."
status: draft
owner: QA - Cursor
last_updated: 2026-07-10
requirement_ref: "qa-docs/supplychain-new-purchase-inbound/requirement.md"
automated: true
automated_spec: "tests/specs/purchase-inbound/pi-approve-show.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (id: 153)."
  - "Purchase Inbound IN-6A506EAC sudah ada (hasil create @TC-PI-CREATE-001) dan berstatus Open (atau sudah Approved untuk re-run idempotent)."
test_data:
  - field: "Transaction Code"
    value: "IN-6A506EAC"
steps:
  - "Buka datalist Purchase Inbound dan cari IN-6A506EAC."
  - "Pastikan trx status Open (jika sudah Approved, validasi read-only + datalist lalu selesai)."
  - "Klik button show/edit (#updateButton) pada kolom action."
  - "Klik tombol checklist biru Approve di panel kanan."
  - "Pada modal Approval, klik Approve."
  - "Verifikasi pesan sukses dan redirect ke datalist."
  - "Cari IN-6A506EAC di datalist; pastikan status Approved."
  - "Buka show lagi; pastikan form read-only (Save All / Approve tidak tersedia)."
expected_result: |
  Purchase Inbound IN-6A506EAC berhasil di-approve.
  Trx status di datalist = Approved.
  Dokumen read-only (tidak bisa diedit lagi).
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS — IN-6A506EAC status Approved di datalist; form show read-only
    (Save All / Approve hilang). Approve API sukses pada run sebelumnya;
    re-run idempotent memvalidasi expected state.
  report_url: null
test_data_used:
  - field: "Runner email"
    value: "playwright@gmail.com"
  - field: "Company"
    value: "lumicharmsid (id: 153)"
  - field: "Automation tag"
    value: "@TC-PI-APPROVE-001"
  - field: "Run command"
    value: "npx playwright test tests/specs/purchase-inbound/pi-approve-show.spec.ts -g @TC-PI-APPROVE-001 --retries=0"
run_history:
  - at: "2026-07-10"
    status: passed
    environment: staging
    note: "Idempotent PASS — sudah Approved; validasi datalist + read-only OK"
  - at: "2026-07-10"
    status: failed
    environment: staging
    note: "Approve API sukses (status jadi Approved) tetapi waitForResponse timeout karena race redirect; helper diperbaiki"
---
