---
doc_type: menu-capability
menu: accounting-sales-return
id: SF-SRA-05
title: Auto-approve
aliases: [auto complete sales return, sales return auto approve]
scope: menu
summary: >-
  Jika Global Setting Sales Return Configuration mengaktifkan auto-approve,
  SR open yang melewati durasi bisa Complete otomatis tanpa klik manual.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Auto-approve

## Apa ini

Proses background yang **menyelesaikan (Complete) otomatis** Sales Return berstatus **open** jika sudah melewati durasi yang dikonfigurasi di **Sales Return Configuration** (Omni / Global Setting).

## Kapan dipakai

- Operasi ingin SR platform tidak menumpuk open terlalu lama.
- Finance perlu sadar: SR bisa selesai **tanpa** klik Complete manual.

## Cara pakai

1. Cek setting: Omni → Global Setting → **Sales Return Configuration**.
2. Lihat apakah **auto approve** aktif dan berapa **durasi** (menit) dari open sampai boleh auto-complete.
3. Job/command terjadwal memproses SR open yang sudah lewat durasi.
4. Setelah auto-complete, dampak sama seperti [Complete](#sf-lingo:SF-SRA-01) manual (stok, jurnal, CN jika Billed).

## Catatan

- Finance tetap bertanggung jawab memastikan COA/qty valid — auto-approve bisa gagal jika prasyarat tidak terpenuhi.
- Jangan menganggap SR open “aman menunggu review lama” jika auto-approve aktif.
- Detail job ada di technical; operator cukup paham perilaku bisnis di atas.

## Contoh

| Setting | Perilaku |
|---------|----------|
| Auto-approve OFF | Hanya Complete manual di menu Finance |
| Auto-approve ON, 60 menit | SR open > 60 menit bisa auto-complete |

## Lihat juga

- [Complete](#sf-lingo:SF-SRA-01)
- Knowledge Base: [§6 FAQ Auto-approve](../knowledge-base.md)
