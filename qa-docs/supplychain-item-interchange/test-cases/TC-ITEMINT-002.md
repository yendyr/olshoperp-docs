---
doc_type: e2e-test-case
tc_code: TC-ITEMINT-002
menu: supplychain-item-interchange
menu_name: "Product Interchange"
title: "mengubah informasi produk substitusi kedua pada data master product interchange"
summary: "menguji proses pembaruan data second product dan deskripsi pada dokumen master hubungan antar produk"
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: "qa-docs/supplychain-item-interchange/requirement.md"
automated: true
automated_spec: "tests/specs/item-interchange/item-interchange-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Kondisi sudah login ke dalam system dan data master sudah terdaftar sebelumnya."
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Data dari TC-ITEMINT-001 tersedia (serial automation)."
test_data:
  - field: "target_first_product"
    value: "CHARM-BEAR-BEADS-Pink"
  - field: "updated_second_product"
    value: "TTK-CHROME-POWDER-gold"
  - field: "description"
    value: "penukaran dialihkan ke TTK-CHROME-POWDER-gold karena model chrome black diganti"
steps:
  - "Buka data yang akan di-update dengan mencari item berdasarkan First Product SKU CHARM-BEAR-BEADS-Pink pada datalist Product Interchange (atau buka langsung edit URL hasil create)."
  - "Klik ikon show/edit (#updateButton) pada baris data master tersebut."
  - "Perbarui Second Product menjadi TTK-CHROME-POWDER-gold."
  - "Masukkan teks catatan pada field Description sesuai data uji."
  - "Klik button Save All untuk memperbarui data master secara permanen."
  - "Verifikasi Second Product + Description tersinkron di halaman datalist."
expected_result: |
  Data master product interchange berhasil diperbarui informasinya dan perubahan produk kedua otomatis langsung tersinkronisasi di halaman datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~38s) — second → TTK-CHROME-POWDER-gold, description Save All, datalist sync OK.
    FE auto-PUT saat ganti second_item; tunggu response sebelum isi description.
  report_url: null
test_data_used:
  - field: "First (target)"
    value: "CHARM-BEAR-BEADS-Pink"
  - field: "Second (updated)"
    value: "TTK-CHROME-POWDER-gold"
  - field: "Description"
    value: "penukaran dialihkan ke TTK-CHROME-POWDER-gold karena model chrome black diganti"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-ITEMINT-002 — chain setelah create"
---

# TC-ITEMINT-002

## Catatan automation

- Spec tag: `@TC-ITEMINT-002`
- Spec: `tests/specs/item-interchange/item-interchange-create-update.spec.ts`
- Helper: `tests/helpers/item-interchange.ts`
- Registry: `tests/pom-registry/item-interchange.yaml`
- TC asli memakai `1ant-a103` — diganti `TTK-CHROME-POWDER-gold` (SKU tersedia di lumicharmsid).
- DataTables search match-from-start: buka edit via clear filter + row scan / edit URL dari create.
