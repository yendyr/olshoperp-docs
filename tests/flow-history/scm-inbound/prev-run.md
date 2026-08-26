# Flow E2E Summary

- Run selesai: 2026-08-25T16:31:40.668Z
- Hasil keseluruhan: **passed**

## scm-inbound — run `PWFLOW-MT8VRHG6` ✅

- Company: `lumicharmsid`
- Supplier: PT. SUPPLIER IDR
- Test data: SKU-RAINCOAT-hitam (qty 25), SKU-RAINCOAT-merah (qty 25)
- Total durasi: 122.7s

| Phase | Menu | Recall TC origin | Status | Durasi | Dokumen dihasilkan | Error |
|-------|------|------------------|--------|--------|--------------------|-------|
| 1 | supplychain-purchase-requisition | TC-PR-CREATE-001<br>TC-PR-UPDATE-002 | ✅ passed | 14.0s | pr_code: `PR-6A8DC2F5`<br>status: `Approved` |  |
| 2 | supplychain-purchase-order | TC-PO-CREATE-001 + TC-PO-UPDATE-001<br>TC-PO-UPDATE-002 | ✅ passed | 83.3s | po_code: `PO-6A8DC302`<br>status: `Approved`<br>consumed_pr: `PR-6A8DC2F5` |  |
| 3 | supplychain-new-purchase-inbound | TC-PI-CREATE-001 | ✅ passed | 25.4s | pi_code: `IN-5U8LYY2W`<br>status: `Open`<br>consumed_po: `PO-6A8DC302` |  |

> TODO: side-effect assertion stok (Real Stock) belum diimplement untuk flow scm-inbound.
