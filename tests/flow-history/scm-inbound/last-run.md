# Flow E2E Summary

- Run selesai: 2026-08-25T13:56:47.098Z
- Hasil keseluruhan: **passed**

## scm-inbound — run `PWFLOW-MT8Q8B0M` ✅

- Company: `lumicharmsid`
- Supplier: PT. SUPPLIER IDR
- Test data: SKU-RAINCOAT-hitam (qty 25), SKU-RAINCOAT-merah (qty 25)
- Total durasi: 121.8s

| Phase | Menu | Recall TC origin | Status | Durasi | Dokumen dihasilkan | Error |
|-------|------|------------------|--------|--------|--------------------|-------|
| 1 | supplychain-purchase-requisition | TC-PR-CREATE-001<br>TC-PR-UPDATE-002 | ✅ passed | 14.1s | pr_code: `PR-6A8D9EA9`<br>status: `Approved` |  |
| 2 | supplychain-purchase-order | TC-PO-CREATE-001 + TC-PO-UPDATE-001<br>TC-PO-UPDATE-002 | ✅ passed | 82.4s | po_code: `PO-6A8D9EB5`<br>status: `Approved`<br>consumed_pr: `PR-6A8D9EA9` |  |
| 3 | supplychain-new-purchase-inbound | TC-PI-CREATE-001 | ✅ passed | 25.4s | pi_code: `IN-5U8KJYCW`<br>status: `Open`<br>consumed_po: `PO-6A8D9EB5` |  |

> TODO: side-effect assertion stok (Real Stock) belum diimplement untuk flow scm-inbound.
