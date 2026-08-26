# ETM-15526

**Judul:** REOPEN - [Stock Remapping] - Remapped To boleh duplicate, Origin pilih per Stock ID, tambah validasi Unit Class (batasan 1 parent tetap)

Sumber langkah & elemen UI: komentar manual [40137](https://erpintegration.atlassian.net/browse/ETM-15526?focusedCommentId=40137).

## Data uji

| SKU | Kondisi |
| --- | --- |
| RM-Variant-Mix | 2 Stock ID: qty 100 @ Rp 0 dan 100 @ Rp 10.000 |
| RM-Variant-White | Primary Pieces, Stock IN 100 @ Rp 10.500 |
| RM-Variant-Pink | Primary Pieces, Stock IN 100 @ Rp 10.500 |

## Elemen UI (dari alur manual)

- Menu: `/accounting/stock-remapping`
- Header: Building Origin (`Choose Building`), Transaction Date, Description, Save & Next / Save All, Approve
- Link **Available Products** → modal per Stock ID (kolom STOCK ID, SKU, Availability, UNIT, UNIT PRICE)
- Tombol **Use / Bulk Use** (checkbox + tooltip-use)
- Detail: SKU Origin, Remapped To, Qty, Availability, Avl. Base Unit, Base Unit, Unit Price, Description
- Dialog **Import History** (TC-09..12, TC-15)

## Scope automation

| Spec | TC |
|------|-----|
| `etm-15526-happy-path.spec.ts` | TC-01, TC-02, TC-04, TC-05, TC-06, TC-07 |
| `etm-15526-failed-tcs.spec.ts` | TC-13, TC-14, TC-15 |
| Skip | TC-03 Single Use (PENDING — tombol belum ada) |
| Belum di-spec | TC-09..TC-12 import FIFO happy path |

---

# ETM-15526

**Judul:** REOPEN - [Stock Remapping] - Remapped To boleh duplicate, Origin pilih per Stock ID, tambah validasi Unit Class (batasan 1 parent tetap)

Happy path V2 (duplicate Remapped To, Bulk Use, Unit Price 1:1, import FIFO) sudah PASS di komentar 40137.

Scope retest ini hanya 3 TC FAILED:

## TC-13 ΓÇö Origin = Remapped To tidak boleh lolos

Expected: Origin Γëá Remapped To di insert / update Origin / update Qty / approve.

Actual sebelumnya: Origin bisa disamakan dengan Remapped To ("The new data has been successfully created."). Validasi "must be different" hanya saat ubah Qty. Approve masih bisa sukses.

## TC-14 ΓÇö Inline edit Remapped To tidak mengubah urutan baris

Expected: Edit Remapped To / Qty / Description tidak memindahkan baris.

Actual sebelumnya: ubah Remapped To ΓåÆ baris pindah ke atas; Qty / Description tetap.

## TC-15 ΓÇö Import validasi & error message

Expected: Qty non-numerik ditolak; semua error required tampil sekaligus; failed row = jumlah baris gagal (bukan jumlah pesan).

Actual sebelumnya: (1) template kosong failed row = 1; (2) Qty "I5" lolos sebagai 5; (3) >1 required kosong hanya 1 error di logs.