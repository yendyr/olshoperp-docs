# Flow E2E Summary

- Run selesai: 2026-08-25T16:23:59.632Z
- Hasil keseluruhan: **passed**

## scm-ap-full — run `PWFLOW-MT8VDGMD` ✅

- Company: `lumicharmsid`
- Supplier: PT. SUPPLIER IDR
- Test data: SKU-RAINCOAT-hitam (qty 5), SKU-RAINCOAT-merah (qty 5)
- Total durasi: 315.9s

| Phase | Menu | Recall TC origin | Status | Durasi | Dokumen dihasilkan | Error |
|-------|------|------------------|--------|--------|--------------------|-------|
| 1 | supplychain-purchase-requisition | TC-PR-CREATE-001<br>TC-PR-UPDATE-002 | ✅ passed | 13.7s | pr_code: `PR-6A8DC066`<br>status: `Approved` |  |
| 2 | supplychain-purchase-order | TC-PO-CREATE-001 + TC-PO-UPDATE-001<br>TC-PO-UPDATE-002 | ✅ passed | 84.1s | po_code: `PO-6A8DC074`<br>status: `Approved`<br>consumed_pr: `PR-6A8DC066` |  |
| 3 | supplychain-new-purchase-inbound | TC-PI-CREATE-001<br>TC-PI-APPROVE-001 | ✅ passed | 32.1s | pi_code: `IN-5U8LVD1Q`<br>status: `Approved`<br>consumed_po: `PO-6A8DC074` |  |
| 4 | accounting-supplier-invoice | TC-PI-001<br>TC-PI-002 | ✅ passed | 43.9s | invoice_code: `PI-6A8DC0E8`<br>status: `Approved`<br>consumed_inbound: `IN-5U8LVD1Q` |  |
| 5 | accounting-supplier-payment | TC-APAY-001<br>TC-APAY-002 | ✅ passed | 129.0s | payment_code: `PY-5U8LVS0S`<br>status: `Approved`<br>consumed_invoice: `PI-6A8DC0E8` |  |
| 6 | journal | TC-JRN-005 | ✅ passed | 13.1s | journal_code: `GL-5U8LWGCL`<br>type: `Payment to Supplier`<br>consumed_payment: `PY-5U8LVS0S` |  |

> TODO: side-effect assertion stok (Real Stock) belum diimplement untuk flow scm-inbound.
