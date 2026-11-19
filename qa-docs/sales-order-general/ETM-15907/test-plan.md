# Test Plan: ETM-15907 — Ubah Unit Price tidak boleh mereset Qty (satuan non-primary)

- **Origin Card:** [ETM-15907](https://erpintegration.atlassian.net/browse/ETM-15907) — `[URGENT] [Sales Order] - Mengubah Unit Price Mereset Nilai Qty Produk saat Menggunakan Satuan Non-Primary`
- **Menu Target:** Sales Order / Dev - Sales Order (`/businessdevelopment/sales-order-general` / `sales-order-general`)
- **Request ID:** `none`
- **Owner / Author:** QA - Rachmatulloh Yendy
- **Status requirement.md:** `review` — `qa-docs/sales-order-general/requirement.md` v3.5 (paritas ASO §6 untuk tipe general).
- **Intent:** `new` — tidak ada di `test-queue.yaml`, tidak ada `origin_jira: ETM-15907` sebelum commit ini.

---

## Tujuan Pengujian

1. Memastikan mengubah **Unit Price** pada baris detail Sales Order **tidak** mengubah / mereset nilai **Qty** (bug card: Qty ter-reset saat satuan non-primary).
2. Memastikan perubahan **Unit Price** hanya mempengaruhi kalkulasi amount / subtotal / tax (rumus kanonik: `Product Amount = (unit price × qty) − disc/item + VAT` — SP/SOG cross-ref).
3. Memvalidasi interaksi **Qty ↔ Unit** (konversi satuan) terpisah dari edit **Unit Price**.
4. Menandai gap requirement: aturan konversi Qty/Price saat pilih satuan alt **belum tertulis** di SOG/ASO; Qty desimal bentrok dengan SOG §5.2 / §7.2.

---

## Validasi vs requirement

| Sumber | Isi relevan | Status vs card |
|---|---|---|
| SOG §5.2 | Qty wajib > 0, **bilangan bulat**; Unit = Primary/alt aktif; Price numeric ≥ 0 | **Beda / gap:** card memakai Qty `0.50 box` (desimal) setelah konversi |
| SOG §7.2 #9–10 | Qty nol/**desimal** ditolak; price negatif ditolak | **Beda:** alur repro card bergantung pada Qty desimal hasil konversi |
| SOG §5.2 / ASO | Tidak ada rumus: mengubah Unit Price ≠ menyentuh Qty | **Selaras arah** dengan expected card — tapi **tidak eksplisit** |
| Card Expected | Ubah Unit Price tidak boleh reset Qty; Qty↔Unit boleh saling mempengaruhi | Diadopsi sebagai **hipotesis uji** + tandai `[MENUNGGU REQUIREMENT]` untuk rumus konversi |

**Keputusan expected (rule 12 / 13 §6):**
- Klaim “Unit Price tidak mereset Qty” → uji sebagai perilaku yang diharapkan card; tidak ada pasal requirement yang membantah; tetap catat sebagai belum tertulis di requirement.
- Klaim konversi `5 pieces` → `0.50 box` → `[MENUNGGU REQUIREMENT]` — SOG menolak Qty desimal.

---

## Cek existing (rule 16 + 13 §5B)

- Queue: tidak ada entry ETM-15907 (jangan tulis test-queue.yaml)
- TC `origin_jira` ETM-15907: baru dibuat di commit ini
- Keputusan: **new**

---

## Matriks Skenario (5 → 5 TC)

| No | Kode Skenario | Test Type | Fokus | Expected (dari requirement / gap) |
|:---:|:---|:---:|:---|:---|
| 1 | `SC-SOG-15907-01` | `happy` | Edit **Unit Price** pada baris satuan **primary** — Qty tidak berubah | Qty tetap; Unit Price tersimpan; amount ter-recalc |
| 2 | `SC-SOG-15907-02` | `happy` | Edit **Unit Price** setelah baris memakai satuan **alt** dengan Qty **bulat** (> 0) | Qty bulat tidak berubah; satuan tetap alt; amount ter-recalc |
| 3 | `SC-SOG-15907-03` | `edge` | Ganti Unit primary → alt yang menghasilkan Qty **desimal** (repro card) | `[MENUNGGU REQUIREMENT]` — SOG §7.2 vs card |
| 4 | `SC-SOG-15907-04` | `negative` | Unit Price negatif | Ditolak (SOG §7.2) |
| 5 | `SC-SOG-15907-05` | `regression` | Edit **Qty** saja pada satuan primary | Qty baru tersimpan; Unit Price tidak berubah sendiri |

---

## Rincian Detail Skenario

### 1. SC-SOG-15907-01 (happy: Edit Unit Price — satuan primary, Qty stabil)
- **Prekondisi:** Login staging company FAT (112). SO General DRAFT/OPEN. Fixture: `https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2521415`. SKU `SKU-PPL-UNIT-001` primary `pieces`.
- **Langkah:** Buka edit → pastikan Unit pieces + Qty bulat → catat Qty/Unit/Unit Price → ubah Unit Price (mis. 500000) → amati Qty/Unit → Save bila perlu.
- **Expected:** Qty & Unit tidak berubah; Unit Price tersimpan; amount = (unit price × qty) − disc + VAT.
- **Requirement ref:** SOG §5.2, §7.2.

### 2. SC-SOG-15907-02 (happy: Edit Unit Price — satuan alt, Qty bulat) — prioritas bug
- **Prekondisi:** Sama; Unit alt `box` dengan Qty bilangan bulat (mis. 1), bukan hasil konversi desimal.
- **Langkah:** Catat Qty/Unit/Unit Price → ubah Unit Price → amati Qty → Save.
- **Expected:** Qty tidak berubah; Unit tetap box; Unit Price update; amount recalc. [CATATAN QA] isolasi field belum pasal eksplisit di requirement.
- **Requirement ref:** SOG §5.2.

### 3. SC-SOG-15907-03 (edge: Konversi Unit → Qty desimal — repro card)
- **Langkah:** Qty 5 pieces → ganti Unit ke box → catat Qty → ubah Unit Price 500000 → catat Qty lagi.
- **Expected:** `[MENUNGGU REQUIREMENT]` perilaku konversi/desimal; hipotesis card: Qty tidak berubah hanya karena edit Unit Price. Jangan hardcode 5→0.50 sebagai SoT.
- **Requirement ref:** SOG §5.2, §7.2 — konflik dengan alur desimal card.

### 4. SC-SOG-15907-04 (negative: Unit Price negatif)
- **Langkah:** Set Unit Price -1 → Save.
- **Expected:** Ditolak SOG §7.2. Pesan UI belum ditetapkan di docs — konfirmasi saat run.

### 5. SC-SOG-15907-05 (regression: Edit Qty saja)
- **Langkah:** Catat Unit Price → ubah Qty ke bilangan bulat lain > 0 → Save.
- **Expected:** Qty tersimpan; Unit Price tidak berubah sendiri; amount recalc.

---

## Validasi Negatif & Batasan

| Item | Mapping |
|---|---|
| Unit Price negatif | SC-SOG-15907-04 |
| Qty desimal / konversi non-integer | SC-SOG-15907-03 |

---

## Checklist mapping Test Plan → TC

| No | Kode Skenario | test_type | File | tc_code |
|:---:|:---|:---:|:---|:---|
| 1 | `SC-SOG-15907-01` | `happy` | `qa-docs/sales-order-general/ETM-15907/test-cases/TC-SOG-DRAFT-20260913214308.md` | `PENDING-20260913214308` |
| 2 | `SC-SOG-15907-02` | `happy` | `qa-docs/sales-order-general/ETM-15907/test-cases/TC-SOG-DRAFT-20260913214309.md` | `PENDING-20260913214309` |
| 3 | `SC-SOG-15907-03` | `edge` | `qa-docs/sales-order-general/ETM-15907/test-cases/TC-SOG-DRAFT-20260913214310.md` | `PENDING-20260913214310` |
| 4 | `SC-SOG-15907-04` | `negative` | `qa-docs/sales-order-general/ETM-15907/test-cases/TC-SOG-DRAFT-20260913214311.md` | `PENDING-20260913214311` |
| 5 | `SC-SOG-15907-05` | `regression` | `qa-docs/sales-order-general/ETM-15907/test-cases/TC-SOG-DRAFT-20260913214312.md` | `PENDING-20260913214312` |
