---
doc_type: e2e-test-case
tc_code: TC-UPDATE-stock-opname
menu: supplychain-stock-opname
menu_name: "Stock Opname"
title: "Update Stock Opname header (Description / status Open)"
summary: "Memperbarui Description dokumen Stock Opname hasil create dan opsional set status Open."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-stock-opname/requirement.md"
automated: true
automated_spec: "tests/specs/stock-opname/stock-opname-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Dokumen dari TC-CREATE-stock-opname tersedia (serial)."
  - "User memiliki akses update; dokumen belum closed/approved (masih editable)."
test_data:
  - field: "Source Code"
    value: "dari create (SP*)"
  - field: "Description (updated)"
    value: "SO automation updated {stamp}"
  - field: "Status"
    value: "Open (jika radio tersedia)"
steps:
  - "Buka edit dokumen hasil create (search code di datalist lalu ikon show/edit)."
  - "Ubah Description sesuai test data."
  - "Opsional: pilih radio status Open."
  - "Klik Save All."
  - "Verifikasi Description terbaru di form dan di datalist."
expected_result: |
  Header Stock Opname berhasil di-update; perubahan Description terlihat di datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~28s) — update description (+ Open jika available), Save All, datalist sync OK.
  report_url: null
test_data_used:
  - field: "Description (updated)"
    value: "SO automation updated {stamp}"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-UPDATE-stock-opname — chain setelah create"
---

# TC-UPDATE-stock-opname

## Step to reproduce (manual)

1. Login staging → company **Lumi Charms.id**.
2. Menu Stock Opname → search **Transaction Code** hasil create.
3. Klik ikon **show/edit** (#updateButton).
4. Ubah **Description** → teks update unik.
5. (Opsional) Pilih radio **Open**.
6. Klik **Save All**.
7. Di datalist, search code → Description harus mencerminkan teks baru.

## Catatan automation

- Spec tag: `@TC-UPDATE-stock-opname`
- Chain serial setelah create; prefer edit URL dari create.
