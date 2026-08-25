# Flow E2E Summary

- Run selesai: 2026-08-25T22:48:52.359Z
- Hasil keseluruhan: **failed**

## scm-ap-full — run `PWFLOW-MT992RI7` ✅

- Company: `lumicharmsid`
- Supplier: PT. SUPPLIER IDR
- Test data: SKU-RAINCOAT-hitam (qty 5), SKU-RAINCOAT-merah (qty 5)
- Total durasi: 97.7s

| Phase | Menu | Recall TC origin | Status | Durasi | Dokumen dihasilkan | Error |
|-------|------|------------------|--------|--------|--------------------|-------|
| 1 | supplychain-purchase-requisition | TC-PR-CREATE-001<br>TC-PR-UPDATE-002 | ✅ passed | 14.1s | pr_code: `PR-6A8E1A4E`<br>status: `Approved` |  |
| 2 | supplychain-purchase-order | TC-PO-CREATE-001 + TC-PO-UPDATE-001<br>TC-PO-UPDATE-002 | ✅ passed | 83.6s | po_code: `PO-6A8E1A5B`<br>status: `Approved`<br>consumed_pr: `PR-6A8E1A4E` |  |

## flow-scm-ap-001 — run `unknown` ❌

- Company: `unknown`
- Supplier: -
- Test data: -
- Total durasi: 193.9s

| Phase | Menu | Recall TC origin | Status | Durasi | Dokumen dihasilkan | Error |
|-------|------|------------------|--------|--------|--------------------|-------|
| 3 | - | — | ❌ failed | 97.4s | — | Error: Riwayat mutasi harus memuat dokumen IN-5U8PDNBF setelah inbound di-approve |
| 3 | - | — | ❌ failed | 96.5s | — | Error: Riwayat mutasi harus memuat dokumen IN-5U8PEQ5P setelah inbound di-approve |
| 4 | - | — | ❌ skipped | 0.0s | — |  |
| 4 | - | — | ❌ skipped | 0.0s | — |  |
| 5 | - | — | ❌ skipped | 0.0s | — |  |
| 5 | - | — | ❌ skipped | 0.0s | — |  |
| 6 | - | — | ❌ skipped | 0.0s | — |  |
| 6 | - | — | ❌ skipped | 0.0s | — |  |

## scm-ap-full — run `PWFLOW-MT99702Q` ✅

- Company: `lumicharmsid`
- Supplier: PT. SUPPLIER IDR
- Test data: SKU-RAINCOAT-hitam (qty 5), SKU-RAINCOAT-merah (qty 5)
- Total durasi: 96.6s

| Phase | Menu | Recall TC origin | Status | Durasi | Dokumen dihasilkan | Error |
|-------|------|------------------|--------|--------|--------------------|-------|
| 1 | supplychain-purchase-requisition | TC-PR-CREATE-001<br>TC-PR-UPDATE-002 | ✅ passed | 14.0s | pr_code: `PR-6A8E1B13`<br>status: `Approved` |  |
| 2 | supplychain-purchase-order | TC-PO-CREATE-001 + TC-PO-UPDATE-001<br>TC-PO-UPDATE-002 | ✅ passed | 82.6s | po_code: `PO-6A8E1B21`<br>status: `Approved`<br>consumed_pr: `PR-6A8E1B13` |  |

> TODO: side-effect assertion stok (Real Stock) belum diimplement untuk flow scm-inbound.
