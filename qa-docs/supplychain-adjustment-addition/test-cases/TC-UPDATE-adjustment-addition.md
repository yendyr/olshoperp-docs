---
doc_type: e2e-test-case
tc_code: TC-UPDATE-adjustment-addition
menu: supplychain-adjustment-addition
menu_name: "Stock Addition"
title: "Update Stock Addition header (Description / status Open)"
summary: "Memperbarui Description dokumen Stock Addition hasil create dan opsional set status Open."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-adjustment-addition/requirement.md"
automated: true
automated_spec: "tests/specs/adjustment-addition/adjustment-addition-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Dokumen dari TC-CREATE-adjustment-addition tersedia (serial)."
  - "User memiliki akses update; dokumen belum approved/closed."
test_data:
  - field: "Source Code"
    value: "dari create (AI*)"
  - field: "Description (updated)"
    value: "AI automation updated {stamp}"
  - field: "Status"
    value: "Open (jika radio tersedia)"
steps:
  - "Buka edit dokumen hasil create."
  - "Ubah Description sesuai test data."
  - "Opsional: pilih radio status Open."
  - "Klik Save All."
  - "Verifikasi Description terbaru di form dan di datalist."
expected_result: |
  Header Stock Addition berhasil di-update; perubahan Description terlihat di datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~29s) — update description (+ Open), Save All, datalist sync OK.
  report_url: null
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-UPDATE-adjustment-addition — chain setelah create"
---

# TC-UPDATE-adjustment-addition

## Step to reproduce (manual)

1. Login staging → company **Lumi Charms.id**.
2. Menu Stock Addition → search **Transaction Code** hasil create.
3. Klik ikon **show/edit**.
4. Ubah **Description** → teks update unik.
5. (Opsional) Pilih radio **Open**.
6. Klik **Save All**.
7. Di datalist, search code → Description harus mencerminkan teks baru.

## Catatan automation

- Spec tag: `@TC-UPDATE-adjustment-addition`
- Chain serial setelah create.
- Approve **tidak** diuji di SCM (tombol Approve disembunyikan; finance menu terpisah).
