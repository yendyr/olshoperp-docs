---
doc_type: knowledge-base
menu: accounting-trial-balance
menu_name: "Trial Balance"
version: 1.3
last_updated: 2026-11-06
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [filters, columns, troubleshooting]
---

# Trial Balance — Knowledge Base

**Menu:** FA → Report → Trial Balance (`/accounting/trial-balance`)

---

## 1. Apa itu Trial Balance?

**Trial Balance** (Neraca Saldo) menampilkan ringkasan saldo debit/kredit per **Chart of Account (COA)** untuk periode yang dipilih. Laporan **read-only** — tidak ada create/edit/delete transaksi dari menu ini.

Data bersumber dari journal berstatus **Approved**.

---

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Beginning balance | Saldo awal periode (mutasi sebelum tanggal mulai) |
| In-period | Mutasi debit/kredit di dalam periode |
| Ending balance | Beginning + in-period (per sisi Debit/Credit) |
| **Balance** (kolom baru) | Nilai net per grup — rumus tergantung tipe akun (Aktiva / Pasiva) |
| COA class | Kelompok akun: Assets, Liabilities, Equity, Revenue, Expense, COGS, Other Revenue & Expenses |
| Activa / Passiva | Sifat class akun di master COA Class (sistem: **Passiva**) |
| Parent COA | Akun induk — saldo di-rollup dari anak |
| Current Profit/Loss | COA khusus laba rugi berjalan |

---

## 3. Yang Bisa / Tidak Bisa

### Bisa

- Pilih **periode** lalu **Apply**
- Lihat 7 tabel per COA class
- Lihat hierarki COA (indent + bold parent)
- Lihat Debit & Credit per grup Beginning / In-Period / Ending
- **(TO-BE ETM-17077)** Lihat kolom **Balance** di tiap grup
- Export Excel (All Data) — unduh lewat riwayat export; header file menampilkan periode filter (ETM-17079)
- **Column Show & Hide** — tampilkan/sembunyikan Debit, Credit, Balance per grup (Beginning / In-Period / Ending) di semua tabel (ETM-17078)

### Tidak Bisa

- Buat / edit / hapus transaksi dari menu ini
- Filter per COA individual di UI (hanya periode global)

---

## 4. Kolom laporan

Setiap tabel punya tiga blok:

| Blok | Kolom (AS-IS) | + TO-BE |
|------|---------------|---------|
| **Beginning Balance** | Debit, Credit | **Balance** |
| **In-Period** | Debit, Credit | **Balance** |
| **Ending Balance** | Debit, Credit | **Balance** |

### Cara baca kolom Balance (ETM-17077)

| Tipe akun (position) | Rumus Balance |
|----------------------|---------------|
| **Activa** (contoh: Assets, Expense, COGS) | Debit − Credit |
| **Passiva** (contoh: Liabilities, Equity, Revenue) | Credit − Debit |

Kalau hasilnya negatif, angka **tetap tampil minus** (bukan dipindah ke sisi lain).

---

## 5. Cara Pakai

1. Buka menu Trial Balance  
2. Pilih **Period** → klik **Apply**  
3. Scroll per section COA class  
4. Bandingkan Debit/Credit/Balance antar Beginning vs Ending  
5. Detail transaksi per akun → **General Ledger** (filter COA & periode sama)

---

## 6. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Semua nol | Periode salah / belum Apply | Pilih periode & Apply |
| Angka ≠ GL baris-per-baris | GL = transaksi; TB = agregasi | Normal; cek total per COA |
| Parent + child double | Parent = rollup anak | Jangan jumlahkan parent + child |
| Balance “terbalik” | Cek apakah akun Activa atau Passiva | Ikuti rumus §4 |
| COA tidak muncul | Tidak ada mutasi / bukan parent relevan | Cek COA master & journal Approved |

---

## 7. FAQ

**Q: Kenapa Balance Assets beda rumus dengan Liabilities?**  
A: Assets = Activa (Debit − Credit); Liabilities = Passiva (Credit − Debit).

**Q: Boleh minus?**  
A: Ya — minus berarti sisi “lawan” lebih besar untuk tipe akun itu.

**Q: Request user bilang Debit − Credit semua?**  
A: Itu request awal; keputusan product memakai rumus by position (lihat ETM-17077).
