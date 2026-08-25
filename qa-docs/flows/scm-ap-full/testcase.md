---
doc_type: e2e-flow-test-case
tc_code: TC-FLOW-SCM-AP-001
flow_id: scm-ap-full
title: "SCM + Accounting AP — PR → PO → Purchase Inbound → Supplier Invoice → Account Payment → Journal"
summary: "Chain 6 phase procure-to-pay: dari permintaan pembelian sampai pelunasan hutang dan verifikasi auto-journal Payment to Supplier. Murni UI crawling."
status: draft
owner: QA - Yemima
last_updated: 2026-08-25
automated: true
automated_spec: "tests/specs/flows/scm-ap-full.spec.ts"
fixture_default: "tests/fixtures/flows/scm-ap-full.fixture.json"
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
  - TC-PI-001
  - TC-PI-002
  - TC-APAY-001
  - TC-APAY-002
  - TC-JRN-005
---

# TC-FLOW-SCM-AP-001 — SCM + Accounting AP Flow

> [!IMPORTANT]
> Dokumen ini TIDAK berisi step detail per menu. Step hidup di TC origin masing-masing
> menu (kolom **Recall TC**). Yang didefinisikan di sini hanya **glue E2E**: urutan
> phase, handoff data antar menu, dan side-effect. Perubahan requirement/UX di sebuah
> menu → update TC origin + scenario menu itu; dokumen ini tidak perlu diubah selama
> urutan chain-nya tetap.

Flow ini **memperluas** `scm-inbound` (phase 1–3 identik, memanggil scenario yang sama)
lalu melanjutkan ke tiga menu accounting.

## Chain

| Phase | Menu | Recall TC | Catatan glue | Consumes | Produces |
|-------|------|-----------|--------------|----------|----------|
| 1 | supplychain-purchase-requisition | TC-PR-CREATE-001, TC-PR-UPDATE-002 | Data produk dari fixture | — | `pr_code` (Approved) |
| 2 | supplychain-purchase-order | TC-PO-CREATE-001, TC-PO-UPDATE-001, TC-PO-UPDATE-002 | With PR; outstanding dari `pr_code` | `pr_code` | `po_code` (Approved) |
| 3 | supplychain-new-purchase-inbound | TC-PI-CREATE-001, TC-PI-APPROVE-001 | **Inbound WAJIB di-approve** — Supplier Invoice hanya bisa menarik inbound approved (requirement SI §2). Memutasi stok (side-effect belum diassert — lihat TODO). | `po_code` | `pi_code` (Approved), `stock_delta` |
| 4 | accounting-supplier-invoice | TC-PI-001, TC-PI-002 | Tarik inbound via modal Inbound Transaction difilter `po_code`; Draft → Open → Approve | `po_code` | `invoice_code` (Approved) |
| 5 | accounting-supplier-payment | TC-APAY-001, TC-APAY-002 | Sumber dana Cash/Bank dari fixture; alokasi Outstanding Purchase Invoice = `invoice_code`; source amount disamakan dengan nilai invoice agar balanced | `invoice_code` | `payment_code` (Approved) |
| 6 | journal | TC-JRN-005 | Baca kode journal dari kolom Journal di datalist payment, lalu verifikasi isinya | `payment_code` | `journal_code` |

## Side-effect yang di-assert

- **Phase 3** → stok bertambah setelah approve. **Belum diassert** — lihat TODO.
- **Phase 4** → Supplier Invoice Approved menerbitkan jurnal AP (Dr Unbilled Goods + Tax + Cost / Cr AP).
- **Phase 6** → auto-journal dari payment: status Approved, TYPE `Payment to Supplier`, Transaction Reference = `payment_code`, ledger memuat COA cash/bank yang dipakai. **Ini side-effect assertion utama flow** — membuktikan rantai AP tersambung sampai General Ledger.

## Prasyarat data (di luar kendali flow)

- Supplier di fixture punya **Product COA** ter-mapping (Unbilled Goods, Tax, AP) — wajib sebelum approve Supplier Invoice (requirement SI §2).
- Company punya **Exchange Diff. COA** & **Cash Diff. COA** — wajib saat approve payment (requirement AP).
- Cash/Bank di fixture punya saldo cukup pada tanggal transaksi.
- Fiscal period terbuka.

Kalau salah satu belum terpenuhi, phase 4/5 akan gagal dengan pesan backend — itu
**temuan data**, bukan bug automation.

## Test data

- Selalu **fresh chain** — tidak pernah reuse dokumen run sebelumnya.
- Default: `tests/fixtures/flows/scm-ap-full.fixture.json`; override per run via env `OLSHOP_FLOW_FIXTURE=/path/custom.json`.
- History eksekusi: `tests/flow-history/scm-ap-full/last-run.md` + `prev-run.md`.

## Cara run

```bash
npm run flow:preflight -- scm-ap-full
npx playwright test tests/specs/flows/scm-ap-full.spec.ts
```

## TODO

### Side-effect stok belum bisa diassert — dua jalur buntu (investigasi 2026-08-26)

| Sumber | Kendala |
|---|---|
| **Real Time Stock** (`supplychain-real-stock`) | Nilainya real-time dan cocok, tapi `requirement.md` masih berstatus `draft` → **ditolak preflight** (rule 17 §0). Perlu requirement dinaikkan ke `review` lebih dulu — keputusan QA lead. |
| **Stock History V2** (`supplychain-product-mutation-stock`) | Requirement sudah `review`, tapi laporannya **berbasis job terjadwal**: header menampilkan *Latest Calculation* / *Last Job Started* / *Next Job Started* (harian). Mutasi dari inbound yang baru di-approve belum muncul sampai job berikutnya berjalan, sehingga tidak bisa dipakai untuk assertion langsung dalam satu run. |

**Opsi yang tersisa** (perlu keputusan):
1. Naikkan `requirement.md` Real Time Stock ke `review`, lalu assert delta stok di sana.
2. Ganti bukti side-effect ke sesuatu yang real-time dan menu-nya sudah matang —
   mis. **outstanding PO berkurang / status PO berubah** setelah inbound approved
   (menu Purchase Order, requirement sudah `review`). Ini membuktikan rantai bekerja
   tanpa bergantung laporan stok.

Sampai salah satunya diputuskan, flow tetap memverifikasi status dokumen di tiap phase
dan auto-journal di phase 6 — tapi **belum** membuktikan dampak ke stok.
