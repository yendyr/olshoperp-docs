# Hasil Automate Testing — ETM-15584

**Tanggal run:** 18 Agustus 2026  
**Environment:** Staging (`https://staging.olshoperp.com`)  
**Company:** Dev Staging / DEV-STG (id 13)  
**Menu:** Stock Remapping (`/accounting/stock-remapping`)  
**Spec:** `tests/specs/stock-remapping/etm-15584-approve-split-stock-id.spec.ts`  
**Perintah:**

```
OLSHOP_COMPANY_CODE=DEV-STG npx playwright test tests/specs/stock-remapping/etm-15584-approve-split-stock-id.spec.ts --project=authenticated -g "@ETM-15584"
```

Kartu: [ETM-15584](https://erpintegration.atlassian.net/browse/ETM-15584)

---

## Ringkasan

**PASS** untuk aksi **Approve** pada transaksi Stock Remapping baru: tidak muncul false error `Insufficient stock … only has 0 base units available for the selected stock`. Status dokumen jadi **Approved**.

Transaksi uji: [RM-5U5XWYAV](https://staging.olshoperp.com/accounting/stock-remapping/edit/130424)

Instruksi run: company Dev Staging (13), buat transaksi baru, SKU Origin di detail = `SKU-RM-01-tosca`. Remapped To (sibling same parent) = `SKU-RM-01-hijau`. Warehouse = Lobby Tanrise.

---

## Detail vs expected kartu

| AC | Skenario kartu | Hasil | Bukti |
|----|----------------|-------|-------|
| AC-approve | Approve berhasil jika alokasi detail valid; tidak ada false Insufficient stock 0 | **PASS** — API `200`, pesan `The data has been Approved`, redirect datalist, status **Approved** | `measurements.json` + `screenshots/05-after-approve.png` |
| AC-split | Qty di-split ke ≥2 Stock ID (batch pertama available jadi 0) — pola kartu 13+2=15 | **Sebagian** — Available Products menampilkan 2 Stock ID, tapi detail dokumen yang ter-approve hanya **1 baris qty 1** | `screenshots/03-available-products.png` + `screenshots/04-detail-after-use.png` |

**AS-IS (docs):** `qa-docs/accounting-stock-remapping/requirement.md` §8.3 (status **review**) — approve wajib cek qty vs availability Stock ID **atau reserved yang valid**. Selaras GAP-RM-03.

---

## Data run

| Item | Nilai |
|------|--------|
| Origin | `SKU-RM-01-tosca` |
| Remapped To | `SKU-RM-01-hijau` |
| Warehouse | Lobby Tanrise |
| Stock ID di Available Products | `534154` available **13** pcs (harga 10); `534155` available **2** pcs (harga 30) |
| Detail setelah Use | 1 baris Origin tosca → hijau, **Qty 1**, Availability 12 |
| Approve | HTTP 200 — `The data has been Approved` |
| Side effect | Deduction `AO-5U5XX2GL`, Addition `AI-5U5XX2CW` (toast datalist: `AI-5U5XX2CW has been approved`) |
| False error Insufficient stock 0 | **Tidak muncul** |

Kartu asli memakai Origin `SKU-RM-01-hijau` qty 15 (split 13+2). Run ini memakai Origin `SKU-RM-01-tosca` sesuai instruksi.

---

## Actual Result (bahasa operasional)

1. Transaksi baru `RM-5U5XWYAV` terbentuk di Dev Staging, gudang Lobby Tanrise.
2. Di Available Products, `SKU-RM-01-tosca` punya dua batch: 13 pcs dan 2 pcs.
3. Setelah Use, detail berisi Origin `SKU-RM-01-tosca` dan Remapped To `SKU-RM-01-hijau` dengan qty **1** (bukan 15).
4. Klik **Approve** berhasil. Tidak ada notifikasi Insufficient stock. Status di datalist **Approved**.

---

## Catatan QA

- Modal Available Products di staging sudah **1 baris per Stock ID** (bukan agregat FIFO lama).
- Kolom Stock ID tidak tampil di tabel detail dokumen (selaras GAP-RM-07 di requirement — AS-IS detail belum 1:1 Stock ID di UI).
- Bulk Use di overlay memakai tombol **Use** / Direct Use; qty default yang masuk detail = **1**, jadi skenario kartu (habiskan batch 13 lalu sisa ke batch 2) **belum terulang 1:1** pada dokumen ini.
- **Rekomendasi:** jika QA lead butuh bukti fix khusus split 13+2, ulang Use per Stock ID dengan qty penuh (13 lalu 2) lalu Approve. Run ini cukup sebagai bukti Approve tidak melempar false Insufficient stock pada dokumen Open yang valid, tetapi **bukan** reproduksi identik langkah kartu.

Draft sisa dari iterasi selector (tidak di-approve): `RM-5U5XTT8Z` (edit/130422), `RM-5U5XVKOJ` (edit/130423).

---

## Isi folder

| File | Isi |
|------|-----|
| `HASIL.md` | Ringkasan ini |
| `screenshots/01-datalist.png` | Datalist Stock Remapping |
| `screenshots/02-header-open.png` | Header transaksi baru Open |
| `screenshots/03-available-products.png` | Available Products SKU-RM-01-tosca (2 Stock ID) |
| `screenshots/04-detail-after-use.png` | Detail Origin tosca → hijau qty 1 |
| `screenshots/05-after-approve.png` | Datalist: RM-5U5XWYAV Approved |
| `measurements.json` | Payload run + verdict PASS |
