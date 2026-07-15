---
doc_type: e2e-test-case
tc_code: TC-CREATE-mutation-transfer-scrap
menu: supplychain-mutation-transfer-scrap
menu_name: "Transfer Broken"
title: "Create Transfer Broken header (TFS*)"
summary: "Membuat header scrap: Building Origin + Location (scrap); code auto TFS*."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-mutation-transfer-scrap/requirement.md"
automated: true
automated_spec: "tests/specs/mutation-transfer-scrap/mutation-transfer-scrap-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-mutation-transfer-internal
  - supplychain-mutation-transfer-external
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Building Origin dengan stock; Location Destination scrap tersedia."
  - "Fiscal period aktif untuk tanggal fallback 09-07-2026."
test_data:
  - field: "Description"
    value: "TFS automation create {stamp}"
steps:
  - "Buka /supplychain/mutation-transfer-scrap/create (datalist AS-IS tanpa tombol Create)."
  - "Pilih Building Origin + Location (scrap); tanggal jika fiscal error."
  - "Description → Save & Next."
  - "Verifikasi code TFS* di form + datalist."
expected_result: |
  Header tersimpan di URL edit scrap; code auto (AS-IS store sering TFI* — seharusnya TFS*).
  Deskripsi tersimpan di form.
test_result:
  status: pass
  started_at: "2026-07-15T07:46:00Z"
  finished_at: "2026-07-15T07:47:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS mutation-transfer-scrap · CREATE (AS-IS TFI*) · company lumicharmsid"
  report_url: null
---

# TC-CREATE-mutation-transfer-scrap

## Fungsi menu

**Transfer Broken (Scrap)** — pindah stok rusak ke virtual warehouse scrap. Prefix **TFS***.

## Catatan automation

- Spec: `@TC-CREATE-mutation-transfer-scrap`
- Helper: `tests/helpers/mutation-transfer-scrap.ts`
- **Tidak** ada `fetchDefaultValues` auto-create (beda TFI/TFE).
- **Tidak** ada tombol Create di datalist — create via deep-link `/create`.
- **AS-IS BE gap:** `ScrapController::store()` tidak inject `code_identifier=TFS` / `process_type=scrap` → code sering **TFI*** (TFS biasanya auto dari TFE broken receive).
- Destination wajib filter label Scrap.
