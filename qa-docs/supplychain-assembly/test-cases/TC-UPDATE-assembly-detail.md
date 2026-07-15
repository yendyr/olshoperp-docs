---
doc_type: e2e-test-case
tc_code: TC-UPDATE-assembly-detail
menu: supplychain-assembly
menu_name: "Assembly"
title: "Add Finish Goods detail + update QTY"
summary: "Di Assembly Detail: pilih Select Product (Header BOM) → bulk-fifo; lalu ubah QTY inline (contoh AS-6A56F627 → QTY=10)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-assembly/requirement.md"
automated: true
automated_spec: "tests/specs/assembly/assembly-create-update.spec.ts; tests/specs/assembly/assembly-update-qty.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - bill-of-material
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Dokumen Draft dengan minimal 1 baris FG (Header BOM Active)."
test_data:
  - field: "Select Product"
    value: "first available Header BOM (HEADERBOM-001)"
  - field: "Target Code (qty update)"
    value: "AS-6A56F627"
  - field: "QTY"
    value: "10"
steps:
  - "Edit Assembly → Assembly Detail."
  - "Select Product → pilih Header BOM (jika belum ada baris)."
  - "Pada baris FG, inline-edit kolom QTY → isi 10 → Tab/blur."
  - "Verifikasi QTY = 10 di grid."
expected_result: |
  FG detail tersimpan; QTY ter-update ke 10 (integer-only AS-IS).
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~1.3m sebelumnya update QTY sukses; re-assert PASS).
    Dokumen AS-6A56F627 — FG HEADERBOM-001 — QTY diubah 1 → 10.
    Building: Manufacture Warehouse | Status: Draft | Type: Assembly.
  report_url: null
test_data_used:
  - field: "Transaction Code"
    value: "AS-6A56F627"
  - field: "FG SKU"
    value: "HEADERBOM-001"
  - field: "QTY"
    value: "10"
  - field: "Max Assembly Qty"
    value: "295"
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-UPDATE-assembly-detail — add FG HEADERBOM-001 (serial create)"
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-UPDATE-assembly-detail — AS-6A56F627 set QTY=10 (assembly-update-qty.spec.ts)"
---

# TC-UPDATE-assembly-detail

## Step to reproduce (manual) — update QTY

1. Login staging → company **Lumi Charms.id**.
2. Menu **SCM → Assembly** → search **AS-6A56F627** → edit.
3. Section **Assembly Detail** → baris **HEADERBOM-001**.
4. Kolom **QTY** → ubah ke **10** → Tab / blur.
5. QTY harus menampilkan **10** (Max Assembly Qty tetap 295).

## Catatan automation

- Spec add FG: `tests/specs/assembly/assembly-create-update.spec.ts` (`@TC-UPDATE-assembly-detail`)
- Spec QTY: `tests/specs/assembly/assembly-update-qty.spec.ts`
- Helper: `setQtyOnDetailRow(10)` — `PUT …/work-order/{id}/work-order-detail`
- AS-IS: QTY **integer-only** dari UI
- Assert jangan pakai `input` pertama di row (bisa kena checkbox)
