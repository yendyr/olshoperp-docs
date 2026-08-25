# Flow E2E Summary

- Run selesai: 2026-08-25T22:55:53.717Z
- Hasil keseluruhan: **passed**

## scm-ap-full — run `PWFLOW-MT99DE7D` ✅

- Company: `lumicharmsid`
- Supplier: PT. SUPPLIER IDR
- Test data: SKU-RAINCOAT-hitam (qty 5), SKU-RAINCOAT-merah (qty 5)
- Total durasi: 318.4s

| Phase | Menu | Recall TC origin | Status | Durasi | Dokumen dihasilkan | Error |
|-------|------|------------------|--------|--------|--------------------|-------|
| 1 | supplychain-purchase-requisition | TC-PR-CREATE-001<br>TC-PR-UPDATE-002 | ✅ passed | 14.6s | pr_code: `PR-6A8E1C3E`<br>status: `Approved` |  |
| 2 | supplychain-purchase-order | TC-PO-CREATE-001 + TC-PO-UPDATE-001<br>TC-PO-UPDATE-002 | ✅ passed | 85.3s | po_code: `PO-6A8E1C4D`<br>status: `Approved`<br>consumed_pr: `PR-6A8E1C3E` |  |
| 3 | supplychain-new-purchase-inbound | TC-PI-CREATE-001<br>TC-PI-APPROVE-001 | ✅ passed | 32.9s | pi_code: `IN-5U8PGDN1`<br>status: `Approved`<br>consumed_po: `PO-6A8E1C4D` |  |
| 4 | accounting-supplier-invoice | TC-PI-001<br>TC-PI-002 | ✅ passed | 44.2s | invoice_code: `PI-6A8E1CC2`<br>status: `Approved`<br>consumed_inbound: `IN-5U8PGDN1` |  |
| 5 | accounting-supplier-payment | TC-APAY-001<br>TC-APAY-002 | ✅ passed | 129.1s | payment_code: `PY-5U8PGSXJ`<br>status: `Approved`<br>consumed_invoice: `PI-6A8E1CC2` |  |
| 6 | journal | TC-JRN-005 | ✅ passed | 12.4s | journal_code: `GL-5U8PHH42`<br>type: `Payment to Supplier`<br>consumed_payment: `PY-5U8PGSXJ` |  |

> TODO: side-effect assertion stok (Real Stock) belum diimplement untuk flow scm-inbound.
