---
doc_type: menu-capability
menu: accounting-debit-note
id: SF-DET-01
title: Payment Source — Cash/Bank
aliases: [payment source DN, cash bank debit note, fund DN]
scope: menu
summary: >-
  Isi sumber dana Debit Note manual: pilih rekening Cash/Bank (currency sama
  dengan header), amount > 0 dan tidak melebihi sisa saldo rekening.
version: 1.0
last_updated: 2026-08-12
status: review
---

# Payment Source — Cash/Bank

## Apa ini

Section **Payment Source** menampung nilai Debit Note **manual** sebagai baris kas/bank. Tanpa minimal satu baris dengan amount valid, **Approve** ditolak (kecuali DN dari Purchase Return yang memakai Return Deposit).

## Kapan dipakai

- Membuat DN **manual** setelah header tersimpan.
- Melengkapi DN hasil **Import Account Payment** (Adjustment DEBIT NOTE) sebelum Approve.
- **Tidak** dipakai untuk DN dari Purchase Return — itu pakai [Return Deposit](#sf-lingo:SF-DN-04).

## Cara pakai

1. Simpan header DN (supplier, tanggal, mata uang, kurs) status **Open**.
2. Buka **Payment Source**.
3. Pilih rekening **Cash/Bank** aktif — currency harus sama dengan header.
4. Isi **Amount** > 0 dan tidak melebihi sisa saldo rekening.
5. Simpan baris → cek total → **Approve**.

## Catatan

- Mata uang rekening harus sama dengan header; beda → rekening tidak muncul / ditolak.
- Amount tidak boleh melebihi sisa saldo kas/bank.
- Satu COA fund tidak boleh duplikat dalam DN yang sama.
- Setelah ada baris fund, ubah supplier / currency / rate / tanggal sering terkunci — hapus detail dulu jika perlu diganti.
- DN dari retur: jangan cari Payment Source — cek section **Return Deposit**.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Bank BCA IDR, saldo cukup | Amount 5.000.000 | Total DN 5 jt; siap Approve |
| Amount > sisa saldo | Simpan baris | Ditolak — melebihi sisa / insufficient |
| DN dari Purchase Return | Buka Payment Source | Kosong — nilai ada di Return Deposit |

## Lihat juga

- [How DN is created](#sf-lingo:SF-DN-01)
- [Total / Paid / Outstanding](#sf-lingo:SF-DN-02)
- [From Purchase Return](#sf-lingo:SF-DN-04)
- Cash/Bank Account: [../accounting-company-detail-bank/](../accounting-company-detail-bank/)
