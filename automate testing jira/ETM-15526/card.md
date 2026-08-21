# ETM-15526

**Judul:** REOPEN - [Stock Remapping] - Remapped To boleh duplicate, Origin pilih per Stock ID, tambah validasi Unit Class (batasan 1 parent tetap)

Happy path V2 (duplicate Remapped To, Bulk Use, Unit Price 1:1, import FIFO) sudah PASS di komentar 40137.

Scope retest ini hanya 3 TC FAILED:

## TC-13 — Origin = Remapped To tidak boleh lolos

Expected: Origin ≠ Remapped To di insert / update Origin / update Qty / approve.

Actual sebelumnya: Origin bisa disamakan dengan Remapped To ("The new data has been successfully created."). Validasi "must be different" hanya saat ubah Qty. Approve masih bisa sukses.

## TC-14 — Inline edit Remapped To tidak mengubah urutan baris

Expected: Edit Remapped To / Qty / Description tidak memindahkan baris.

Actual sebelumnya: ubah Remapped To → baris pindah ke atas; Qty / Description tetap.

## TC-15 — Import validasi & error message

Expected: Qty non-numerik ditolak; semua error required tampil sekaligus; failed row = jumlah baris gagal (bukan jumlah pesan).

Actual sebelumnya: (1) template kosong failed row = 1; (2) Qty "I5" lolos sebagai 5; (3) >1 required kosong hanya 1 error di logs.
