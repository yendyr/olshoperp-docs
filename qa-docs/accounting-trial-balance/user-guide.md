---
doc_type: user-guide
menu: accounting-trial-balance
menu_name: "Trial Balance"
version: 1.4
last_updated: 2026-11-09
owner: QA - Yemima
status: review
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: "requirement 1.4 / knowledge-base 1.4 / technical 1.4"
audience: publish
---

# Trial Balance — User Guide

## Tujuan

Melihat **neraca saldo** per akun (COA) untuk periode tertentu: saldo awal, mutasi di periode, dan saldo akhir (Debit & Credit), plus kolom **Balance** per grup.

**Buka:** Accounting → Report → **Trial Balance**  
**URL:** `/accounting/trial-balance`

---

## Langkah cepat

1. Pilih **Period** (rentang tanggal).
2. Klik **Apply**.
3. Baca tujuh tabel per kelompok akun (Assets, Liabilities, Equity, …).
4. Tiap tabel punya tiga grup kolom: **Beginning Balance**, **In-Period**, **Ending Balance**.

---

## Kolom Balance

Di tiap grup, setelah Debit & Credit, ada kolom **Balance**:

| Jenis akun | Cara hitung Balance |
|------------|---------------------|
| Aktiva (Activa) — mis. Assets, Expense | Debit − Credit |
| Pasiva (Passiva) — mis. Liabilities, Equity, Revenue | Credit − Debit |

Angka boleh **minus** — artinya sisi lawan lebih besar untuk tipe akun itu.

---

## Column Show & Hide (ETM-17078)

Di toolbar daftar, buka **Column Show & Hide**. Centang atau hilangkan kolom **Debit**, **Credit**, atau **Balance** untuk grup Beginning Balance, In-Period Transaction, dan Ending Balance. Perubahan berlaku ke semua tabel di halaman. Reset mengembalikan semua kolom angka. Ini hanya mengatur tampilan, tidak mengubah angka maupun file export.

## Export Excel (ETM-17079)

Setelah memilih **Period** dan **Apply**, export All Data menghasilkan file Excel. Baris pertama header menampilkan periode yang dipakai, misalnya:

`OlshopERP | Trial Balance Period 01-11-2026 - 06-11-2026`

Tanggal mengikuti filter Period saat export (format `dd-mm-yyyy`). Unduh dari riwayat export bila proses berjalan di background.

## Tips

- Jangan jumlahkan baris parent + child (parent sudah ringkasan anak).
- Butuh transaksi per akun → buka **General Ledger**.
- Cek header export untuk memastikan periode sesuai filter.
- Kalau Period dikosongkan, laporan dan header export memakai tanggal hari ini (awal sama dengan akhir).
