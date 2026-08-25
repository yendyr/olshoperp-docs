# Flow E2E Summary

- Run selesai: 2026-08-25T23:27:52.292Z
- Hasil keseluruhan: **failed**

## scm-ap-full — run `PWFLOW-MT9ACEMB` ✅

- Company: `lumicharmsid`
- Supplier: PT. SUPPLIER IDR
- Test data: SKU-RAINCOAT-hitam (qty 5), SKU-RAINCOAT-merah (qty 5)
- Total durasi: 176.2s

| Phase | Menu | Recall TC origin | Status | Durasi | Dokumen dihasilkan | Error |
|-------|------|------------------|--------|--------|--------------------|-------|
| 1 | supplychain-purchase-requisition | TC-PR-CREATE-001<br>TC-PR-UPDATE-002 | ✅ passed | 14.8s | pr_code: `PR-6A8E22A0`<br>status: `Approved` |  |
| 2 | supplychain-purchase-order | TC-PO-CREATE-001 + TC-PO-UPDATE-001<br>TC-PO-UPDATE-002 | ✅ passed | 83.1s | po_code: `PO-6A8E22AE`<br>status: `Approved`<br>consumed_pr: `PR-6A8E22A0` |  |
| 3 | supplychain-new-purchase-inbound | TC-PI-CREATE-001<br>TC-PI-APPROVE-001 | ✅ passed | 34.3s | pi_code: `IN-5U8PPC2J`<br>status: `Approved`<br>consumed_po: `PO-6A8E22AE` |  |
| 4 | accounting-supplier-invoice | TC-PI-001<br>TC-PI-002 | ✅ passed | 44.0s | invoice_code: `PI-6A8E2323`<br>status: `Approved`<br>consumed_inbound: `IN-5U8PPC2J` |  |

## flow-scm-ap-001 — run `unknown` ❌

- Company: `unknown`
- Supplier: -
- Test data: -
- Total durasi: 245.8s

| Phase | Menu | Recall TC origin | Status | Durasi | Dokumen dihasilkan | Error |
|-------|------|------------------|--------|--------|--------------------|-------|
| 5 | - | — | ❌ failed | 126.4s | — | Error: Update amount source gagal: Insufficient balance on selected fund source |
| 5 | - | — | ❌ failed | 119.4s | — | Error: Use Cash/Bank gagal: Insufficient balance for cash/bank: Bank BCA 001 |
| 6 | - | — | ❌ skipped | 0.0s | — |  |
| 6 | - | — | ❌ skipped | 0.0s | — |  |

## scm-ap-full — run `PWFLOW-MT9AIXYX` ✅

- Company: `lumicharmsid`
- Supplier: PT. SUPPLIER IDR
- Test data: SKU-RAINCOAT-hitam (qty 5), SKU-RAINCOAT-merah (qty 5)
- Total durasi: 177.3s

| Phase | Menu | Recall TC origin | Status | Durasi | Dokumen dihasilkan | Error |
|-------|------|------------------|--------|--------|--------------------|-------|
| 1 | supplychain-purchase-requisition | TC-PR-CREATE-001<br>TC-PR-UPDATE-002 | ✅ passed | 14.3s | pr_code: `PR-6A8E23D1`<br>status: `Approved` |  |
| 2 | supplychain-purchase-order | TC-PO-CREATE-001 + TC-PO-UPDATE-001<br>TC-PO-UPDATE-002 | ✅ passed | 84.4s | po_code: `PO-6A8E23DF`<br>status: `Approved`<br>consumed_pr: `PR-6A8E23D1` |  |
| 3 | supplychain-new-purchase-inbound | TC-PI-CREATE-001<br>TC-PI-APPROVE-001 | ✅ passed | 34.3s | pi_code: `IN-5U8PR0CK`<br>status: `Approved`<br>consumed_po: `PO-6A8E23DF` |  |
| 4 | accounting-supplier-invoice | TC-PI-001<br>TC-PI-002 | ✅ passed | 44.3s | invoice_code: `PI-6A8E2456`<br>status: `Approved`<br>consumed_inbound: `IN-5U8PR0CK` |  |

> TODO: side-effect assertion stok (Real Stock) belum diimplement untuk flow scm-inbound.
