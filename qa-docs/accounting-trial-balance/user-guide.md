---
doc_type: user-guide
menu: accounting-trial-balance
menu_name: "Trial Balance"
version: 1.3
last_updated: 2026-11-06
owner: QA - Yemima
status: review
source_version: "requirement 1.3 / knowledge-base 1.3 / technical 1.3"
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

## Kolom Balance (baru — ETM-17077)

Di tiap grup, setelah Debit & Credit, ada kolom **Balance**:

| Jenis akun | Cara hitung Balance |
|------------|---------------------|
| Aktiva (Activa) — mis. Assets, Expense | Debit − Credit |
| Pasiva (Passiva) — mis. Liabilities, Equity, Revenue | Credit − Debit |

Angka boleh **minus** — artinya sisi lawan lebih besar untuk tipe akun itu.

---

## Column Show & Hide (ETM-17078)

Di toolbar daftar, buka **Column Show & Hide**. Centang/hilangkan kolom **Debit**, **Credit**, atau **Balance** untuk grup Beginning Balance, In-Period Transaction, dan Ending Balance. Perubahan berlaku ke semua tabel di halaman. Hanya mengatur tampilan, tidak mengubah angka.

## Export Excel (ETM-17079)

Setelah memilih **Period** dan **Apply**, export All Data menghasilkan file Excel. Baris pertama header menampilkan periode yang dipakai, misalnya:

`OlshopERP | Trial Balance Period 01-11-2026 - 06-11-2026`

Tanggal mengikuti filter Period saat export (format `dd-mm-yyyy`). Unduh dari riwayat export bila proses berjalan di background.

## Tips

- Jangan jumlahkan baris parent + child (parent sudah ringkasan anak).  
- Butuh transaksi per akun → buka **General Ledger**.  
- Cek header export untuk memastikan periode sesuai filter.
