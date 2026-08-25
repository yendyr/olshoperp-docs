# Flow E2E Summary

- Run selesai: 2026-08-25T16:29:37.047Z
- Hasil keseluruhan: **passed**

## scm-ap-full — run `PWFLOW-MT8VKIKY` ✅

- Company: `lumicharmsid`
- Supplier: PT. SUPPLIER IDR
- Test data: SKU-RAINCOAT-hitam (qty 5), SKU-RAINCOAT-merah (qty 5)
- Total durasi: 324.1s

| Phase | Menu | Recall TC origin | Status | Durasi | Dokumen dihasilkan | Error |
|-------|------|------------------|--------|--------|--------------------|-------|
| 1 | supplychain-purchase-requisition | TC-PR-CREATE-001<br>TC-PR-UPDATE-002 | ✅ passed | 14.5s | pr_code: `PR-6A8DC1B0`<br>status: `Approved` |  |
| 2 | supplychain-purchase-order | TC-PO-CREATE-001 + TC-PO-UPDATE-001<br>TC-PO-UPDATE-002 | ✅ passed | 83.6s | po_code: `PO-6A8DC1BD`<br>status: `Approved`<br>consumed_pr: `PR-6A8DC1B0` |  |
| 3 | supplychain-new-purchase-inbound | TC-PI-CREATE-001<br>TC-PI-APPROVE-001 | ✅ passed | 32.6s | pi_code: `IN-5U8LX67C`<br>status: `Approved`<br>consumed_po: `PO-6A8DC1BD` |  |
| 4 | accounting-supplier-invoice | TC-PI-001<br>TC-PI-002 | ✅ passed | 44.4s | invoice_code: `PI-6A8DC232`<br>status: `Approved`<br>consumed_inbound: `IN-5U8LX67C` |  |
| 5 | accounting-supplier-payment | TC-APAY-001<br>TC-APAY-002 | ✅ passed | 136.3s | payment_code: `PY-5U8LXMO0`<br>status: `Approved`<br>consumed_invoice: `PI-6A8DC232` |  |
| 6 | journal | TC-JRN-005 | ✅ passed | 12.7s | journal_code: `GL-5U8LYAW6`<br>type: `Payment to Supplier`<br>consumed_payment: `PY-5U8LXMO0` |  |

> TODO: side-effect assertion stok (Real Stock) belum diimplement untuk flow scm-inbound.
