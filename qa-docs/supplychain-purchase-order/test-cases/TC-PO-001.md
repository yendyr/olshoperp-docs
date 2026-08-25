---
doc_type: e2e-test-case
tc_code: TC-PO-001
menu: supplychain-purchase-order
menu_name: "Purchase Order"
title: "DATALIST — UI export standar sidebar Export (tanpa Export CSV / Export Excel di halaman utama) — 12 menu Farrel"
summary: "12 menu yang baru distandarisasi: tombol Export CSV/Excel tidak di halaman utama; opsi With Details / Without Details / This Page Only di sidebar Export."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/supplychain-purchase-order/requirement.md §3.3 & §13.2; qa-docs/supplychain-purchase-requisition/requirement.md §9.2; qa-docs/supplychain-assembly/requirement.md A-05"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-purchase-requisition
  - supplychain-manual-picking-list
  - supplychain-mutation-outbound
  - supplychain-adjustment-addition
  - supplychain-adjustment-deduction
  - supplychain-stock-opname
  - supplychain-assembly
  - accounting-adjustment-inbound
  - accounting-adjustment-outbound
  - accounting-stock-opname-approval
  - accounting-opening-stock
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: FAT (id 112)."
  - "Role punya akses 12 menu di daftar langkah (SCM + FA)."
test_data:
  - field: "Scope card"
    value: "12 menu yang distandarisasi Farrel (komentar 14 Agu 2026 di ETM-15469) — bukan seluruh module"
  - field: "Label toolbar (UI)"
    value: "Export"
  - field: "Label slideover (UI)"
    value: "Export"
  - field: "Opsi dropdown di sidebar (UI / requirement)"
    value: "With Details ; Without Details ; This Page Only"
  - field: "Label terlarang di halaman utama"
    value: "Export Excel ; Export CSV"
steps:
  - "Untuk tiap URL di daftar (kecuali Outbound External dulu): buka datalist, cek toolbar halaman utama."
  - "Halaman utama: pastikan tidak ada tombol/menu **Export Excel** atau **Export CSV**."
  - "Halaman utama: ada tombol **Export**. Klik **Export** — slideover judul **Export** terbuka (bukan tab terpisah di halaman)."
  - "Di dalam slideover: ada dropdown **Export** berisi **With Details**, **Without Details**, dan **This Page Only**. Ada tabel history file (kolom Action, File Name, Export By / Export At, Finished At, Status)."
  - "Catat PASS/FAIL per URL di test_data_used."
  - "Outbound External — https://staging.olshoperp.com/supplychain/mutation-outbound : tombol **Export** sedang dimatikan (komentar Farrel di ETM-15469). PASS jika tidak ada **Export Excel** / **Export CSV** di halaman utama dan **Export** tidak bisa dipakai. Jika **Export** justru aktif penuh, catat observasi vs catatan Farrel (bukan fail AC standardisasi)."
  - "Daftar URL: /supplychain/purchase-requisition ; /supplychain/purchase-order ; /supplychain/manual-picking-list ; /supplychain/mutation-outbound ; /supplychain/adjustment-addition ; /supplychain/adjustment-deduction ; /supplychain/stock-opname ; /supplychain/assembly ; /accounting/adjustment-inbound ; /accounting/adjustment-outbound ; /accounting/stock-opname-approval ; /accounting/opening-stock."
expected_result: |
  Untuk 11 menu dengan export ON (semua di daftar kecuali Outbound External):
  1. Halaman utama datalist tidak menampilkan tombol **Export Excel** atau **Export CSV**.
  2. Export masuk lewat tombol **Export** → slideover **Export**.
  3. Opsi di sidebar: **With Details**, **Without Details**, **This Page Only** (requirement PO §3.3 / §13.2; PR §9.2; Assembly A-05).
  4. History file export terlihat di tabel dalam slideover yang sama.
  5. Tidak ada button format CSV vs Excel yang terpisah.

  Outbound External: tombol **Export** dimatikan; tetap tidak ada **Export Excel** / **Export CSV** di halaman utama.

  [CATATAN QA] Expected UI di atas = TO-BE [ETM-15469](https://erpintegration.atlassian.net/browse/ETM-15469) + label requirement **With Details / Without Details / This Page Only**.
  Card AC memakai istilah **Export Data**, **Active Page Only**, dan **History Audit Log Export**. Label UI staging = tombol/slideover **Export**, opsi **This Page Only** (bukan Active Page Only). Requirement PO/PR masih menulis "tab Export File".
  Scope run = 12 menu di komentar Farrel 14 Agu 2026 — bukan "seluruh module yang punya export". Menu lain di luar daftar ini tidak diuji di TC ini.
  Referensi: qa-docs/supplychain-purchase-order/requirement.md §3.3 & §13.2; qa-docs/supplychain-purchase-requisition/requirement.md §9.2; qa-docs/supplychain-assembly/requirement.md A-05 / §9.1.
test_result:
  status: pass
  started_at: "2026-08-17 20:24"
  finished_at: "2026-08-17 20:30"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: "12/12 menu: tidak ada Export Excel/CSV di halaman utama. Tombol Export → slideover Export; opsi With Details / Without Details / This Page Only; tabel history ada. Outbound External: Export ON (observasi vs catatan Farrel 'dimatikan' — bukan FAIL AC)."
  report_url: null
test_data_used:
  - field: "Purchase Requisition"
    value: "PASS — https://staging.olshoperp.com/supplychain/purchase-requisition"
  - field: "Purchase Order"
    value: "PASS — https://staging.olshoperp.com/supplychain/purchase-order"
  - field: "Manual Picking List"
    value: "PASS — https://staging.olshoperp.com/supplychain/manual-picking-list"
  - field: "Outbound External"
    value: "PASS UI standar; observasi Export ON (bukan dimatikan) — https://staging.olshoperp.com/supplychain/mutation-outbound"
  - field: "Stock Addition"
    value: "PASS — https://staging.olshoperp.com/supplychain/adjustment-addition"
  - field: "Stock Deduction"
    value: "PASS — https://staging.olshoperp.com/supplychain/adjustment-deduction"
  - field: "Stock Opname"
    value: "PASS — https://staging.olshoperp.com/supplychain/stock-opname"
  - field: "Assembly"
    value: "PASS — https://staging.olshoperp.com/supplychain/assembly"
  - field: "Stock Addition Approval"
    value: "PASS — https://staging.olshoperp.com/accounting/adjustment-inbound"
  - field: "Stock Deduction Approval"
    value: "PASS — https://staging.olshoperp.com/accounting/adjustment-outbound"
  - field: "Stock Opname Approval"
    value: "PASS — https://staging.olshoperp.com/accounting/stock-opname-approval"
  - field: "Opening Stock"
    value: "PASS — https://staging.olshoperp.com/accounting/opening-stock"
run_history:
  - at: "2026-08-17 20:30"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
origin_jira: ETM-15469
last_execution:
  at: "2026-08-17 20:30"
  jira: ETM-15469
---

## Catatan QA

Card: [ETM-15469](https://erpintegration.atlassian.net/browse/ETM-15469) — Improvement, **QA Review**. Clone [ETM-14328](https://erpintegration.atlassian.net/browse/ETM-14328).

Satu TC checklist untuk 12 menu Farrel. Jangan clone 12 file dengan steps identik.

**Outbound External** — Farrel (14 Agu): button export sedang dimatikan. Run 17 Agu: **Export ON** + opsi standar. Bukan FAIL AC (UI sudah standar). Catat sebagai observasi.

Jangan uji menu di luar daftar Farrel di TC ini (sisa menu masih unreopen / saran card per menu).

Run 17 Agu 2026: **PASS** 12/12. User: playwright@gmail.com.
