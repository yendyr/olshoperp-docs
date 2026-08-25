---
doc_type: e2e-flow-test-case
tc_code: TC-FLOW-SCM-INBOUND-001
flow_id: scm-inbound
title: "SCM Inbound — PR → PO With PR → Purchase Inbound (fresh chain)"
summary: "Chain 3 menu procurement: create+approve PR, tarik outstanding-nya ke PO With PR lalu approve, buat Purchase Inbound dari PO tersebut (opsional approve). Murni UI crawling."
status: draft
owner: QA - Yemima
last_updated: 2026-08-24
automated: true
automated_spec: "tests/specs/flows/scm-inbound.spec.ts"
fixture_default: "tests/fixtures/flows/scm-inbound.fixture.json"
execution_company:
  id: 153
  code: lumicharmsid
recalls:
  - TC-PR-CREATE-001
  - TC-PR-UPDATE-002
  - TC-PO-CREATE-001
  - TC-PO-UPDATE-001
  - TC-PO-UPDATE-002
  - TC-PI-CREATE-001
  - TC-PI-APPROVE-001
---

# TC-FLOW-SCM-INBOUND-001 — SCM Inbound Flow

> [!IMPORTANT]
> Dokumen ini TIDAK berisi step detail per menu. Step per menu hidup di TC origin
> masing-masing menu (kolom **Recall TC**) — satu sumber kebenaran. Yang didefinisikan
> di sini hanya **glue E2E**: urutan phase, handoff data antar menu, dan side-effect.
> Perubahan requirement/UX di sebuah menu → update TC origin + scenario menu tersebut,
> dokumen flow ini tidak perlu diubah selama urutan chain-nya tetap.

## Chain

| Phase | Menu | Recall TC | Varian / catatan glue | Consumes | Produces |
|-------|------|-----------|----------------------|----------|----------|
| 1 | supplychain-purchase-requisition | TC-PR-CREATE-001 | Data produk dari fixture (bukan data statis TC origin) | — | `pr_code` (Open) |
| 1 | supplychain-purchase-requisition | TC-PR-UPDATE-002 | Approve dari datalist atas `pr_code` fresh (bukan PR statis di TC origin) | `pr_code` | `pr_code` (Approved) |
| 2 | supplychain-purchase-order | TC-PO-CREATE-001 | With PR; outstanding diambil dari `pr_code` Phase 1 | `pr_code` | `po_code` (Draft→) |
| 2 | supplychain-purchase-order | TC-PO-UPDATE-001 | Set Open langsung di form create (varian: tanpa buka ulang dari show) | `po_code` | `po_code` (Open) |
| 2 | supplychain-purchase-order | TC-PO-UPDATE-002 | Approve dari datalist | `po_code` | `po_code` (Approved) |
| 3 | supplychain-new-purchase-inbound | TC-PI-CREATE-001 | Outstanding difilter kode PO Phase 2; qty = full receive dari fixture | `po_code` | `pi_code` (Open) |
| 3 | supplychain-new-purchase-inbound | TC-PI-APPROVE-001 | Hanya jika `approve_inbound: true` di fixture (memutasi stok!) | `pi_code` | `pi_code` (Approved) |

## Side-effect yang harus di-assert (TODO — belum diautomasi)

- Setelah Phase 2: qty outstanding PR (Phase 1) berkurang.
- Setelah Phase 3 approve: stok Real Stock bertambah sesuai inbound qty; status PO menjadi Fully/Partial Received.

## Test data

- Selalu **fresh chain** — tidak pernah reuse dokumen dari run sebelumnya.
- Default: `tests/fixtures/flows/scm-inbound.fixture.json`; override per run via env `OLSHOP_FLOW_FIXTURE=/path/custom.json`.
- History eksekusi (untuk banding before/after): `tests/flow-history/scm-inbound/last-run.md` + `prev-run.md`.

## Cara run

```bash
npx playwright test tests/specs/flows/scm-inbound.spec.ts
```
