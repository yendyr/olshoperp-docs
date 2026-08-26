---
doc_type: e2e-test-case
tc_code: TC-PI-002
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
test_type: happy
title: "New Colli — satu colli berisi minimal dua SKU berbeda dengan Choose Colli Type"
summary: "Bulk Use dua SKU PO → New Colli + pilih tipe → colli code tergenerate; kedua SKU tercatat dalam colli yang sama."
status: draft
owner: QA - Cursor
last_updated: 2026-08-20
requirement_ref: "qa-docs/supplychain-new-purchase-inbound/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-colli-type
    menu_name: "Colli Type"
    role: involved
    note: "Master tipe colli (Box, Pallet) untuk Choose Colli Type"
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "Ada PO Approved dengan minimal dua SKU berbeda masih outstanding."
  - "Ada minimal satu Colli Type Active (contoh BOX atau PLT)."
  - "Purchase Inbound Draft/Open; Location Destination terisi."
  - "URL menu: https://staging.olshoperp.com/supplychain/new-purchase-inbound"
test_data:
  - field: "SKU A"
    value: "(dari outstanding PO — catat saat run)"
  - field: "SKU B"
    value: "(dari outstanding PO — berbeda dari SKU A)"
  - field: "Colli Type"
    value: "(Active, contoh PLT | Pallet)"
  - field: "Inbound Qty per SKU"
    value: "(≤ sisa outstanding masing-masing)"
steps:
  - "Create atau buka Purchase Inbound Draft/Open; isi Supplier, Location Destination, Transaction Date."
  - "Save & Next; catat transaction code IN-* dan URL edit."
  - "Available Purchase Order → centang SKU A dan SKU B → **Bulk Use**."
  - "Centang kedua baris detail → aksi **New Colli** (atau bulk New Colli sesuai UI)."
  - "Pada **Choose Colli Type**, pilih tipe Active (contoh Pallet)."
  - "Konfirmasi create colli baru (jika modal tanya create new vs existing — pilih create new)."
  - "Save All."
  - "Verifikasi di detail: kolom **Colli Code** / hexa colli ID terisi dan **sama** untuk SKU A dan SKU B."
  - "Buka https://staging.olshoperp.com/supplychain/multisku-colli — pastikan satu Colli code dengan type yang dipilih dan dua SKU terikat."
expected_result: |
  Satu unit colli dapat menampung **beberapa SKU berbeda** (Colli V2 — [ETM-15528](https://erpintegration.atlassian.net/browse/ETM-15528) AC #1–2).
  Sistem **auto-generate Colli code** jika belum ada colli (catatan dev card poin 5).
  **Choose Colli Type** menampilkan tipe Active (Box, Pallet, dll.).
  Kedua SKU tersimpan di colli yang sama; kolom hexa/colli ID visible di detail inbound.
  Data konsisten di menu Multisku Colli.

  [CATATAN QA] Requirement canonical `requirement.md` §8 masih mendeskripsikan model COLLI lama (jumlah koli × isi per koli). Expected di atas mengacu acceptance criteria ETM-15528 sampai requirement Colli V2 di-merge ke docs.
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15528
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-PI-DRAFT-20260820091825

## Catatan QA

Happy path re-test guidance ETM-15528 item #1–2. Reuse precondition Colli Type dari TC-CT-007 jika perlu.
