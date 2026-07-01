---
doc_type: e2e-test-case
tc_code: TC-ARCP-002
menu: accounting-customer-payment
menu_name: Account Receive
title: Single use — Save tanpa paid amount ditolak
summary: Sub-modal alokasi tanpa amount → error validasi, detail tidak terinsert
status: review
owner: QA - Yemima
last_updated: "2026-06-26"
requirement_ref: "§1 (alokasi ke SI outstanding)"
automated: true
automated_spec: e2e/account-receive-single-use-empty-amount.spec.ts
execution_company:
  code: FAT
  id: 112
related_menus:
  - menu_slug: accounting-customer-payment
    menu_name: Account Receive
    role: primary
    note: Modal Available + sub-modal single use
  - menu_slug: accounting-customer-invoice
    menu_name: Sales Invoice
    role: involved
    note: SI outstanding di modal Available
preconditions:
  - Sama seperti TC-ARCP-001 (AR open, can_update, ada SI outstanding).
test_data:
  - field: Transaksi AR
    value: RC-5TM6UX14 (id 3016) atau AR open setara di FAT
steps:
  - Login FAT → buka form edit AR open (contoh id 3016).
  - Buka **Available Sales Invoice** → klik **Use** pada satu baris SI.
  - Pada sub-modal **Use this to Payment Process**, **jangan** isi amount dan **jangan** klik Allocate Full Amount.
  - Klik **Save** langsung.
  - Periksa pesan error dan tabel detail AR.
expected_result: |
  - Muncul pesan error validasi (UI dan/atau API): amount wajib diisi / paid amount tidak valid.
  - **Tidak** ada baris detail baru di tabel Detail Account Receive.
  - Backend tetap menolak payload kosong (`amount_before_discount_before_vat` required) atau amount ≤ 0.
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
---

## Catatan QA

- Memastikan strict validation **single use** tetap aktif; ini bukan bug.
- Pesan API contoh: `The amount before discount before vat field is required.` atau `To be paid amount must be less than invoice outstanding amount` (jika amount = 0).
- Happy path single use → [TC-ARCP-001](./TC-ARCP-001.md).
