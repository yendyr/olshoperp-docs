# Flow E2E Summary

- Run selesai: 2026-08-26T00:28:16.545Z
- Hasil keseluruhan: **passed**

## scm-inbound — run `PWFLOW-MT9CSB9S` ✅

- Company: `lumicharmsid`
- Supplier: PT. SUPPLIER IDR
- Test data: SKU-RAINCOAT-hitam (qty 25), SKU-RAINCOAT-merah (qty 25)
- Total durasi: 126.5s

| Phase | Menu | Recall TC origin | Status | Durasi | Dokumen dihasilkan | Error |
|-------|------|------------------|--------|--------|--------------------|-------|
| 1 | supplychain-purchase-requisition | TC-PR-CREATE-001<br>TC-PR-UPDATE-002 | ✅ passed | 15.3s | pr_code: `PR-6A8E32A5`<br>status: `Approved` |  |
| 2 | supplychain-purchase-order | TC-PO-CREATE-001 + TC-PO-UPDATE-001<br>TC-PO-UPDATE-002 | ✅ passed | 85.4s | po_code: `PO-6A8E32B7`<br>status: `Approved`<br>consumed_pr: `PR-6A8E32A5` |  |
| 3 | supplychain-new-purchase-inbound | TC-PI-CREATE-001 | ✅ passed | 25.8s | pi_code: `IN-5U8QBUUR`<br>status: `Open`<br>consumed_po: `PO-6A8E32B7` |  |

> TODO: side-effect assertion stok (Real Stock) belum diimplement untuk flow scm-inbound.
