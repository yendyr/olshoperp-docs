---
doc_type: user-guide
menu: accounting-trial-balance
menu_name: "Trial Balance"
version: 1.0
last_updated: 2026-11-05
owner: QA - Yemima
status: review
source_version: "requirement 1.1 / knowledge-base 1.1 / technical 1.1"
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

## Tips

- Jangan jumlahkan baris parent + child (parent sudah ringkasan anak).  
- Butuh transaksi per akun → buka **General Ledger**.  
- Export Excel dari menu ini belum tersedia.
