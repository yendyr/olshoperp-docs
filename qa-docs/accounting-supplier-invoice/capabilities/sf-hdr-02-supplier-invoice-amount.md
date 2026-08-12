---
doc_type: menu-capability
menu: accounting-supplier-invoice
id: SF-HDR-02
title: Supplier's Invoice Amount
aliases: [supplier invoice amount, invoice diff, cash diff PI]
scope: menu
status_feature: TO-BE
menus_that_may_surface: [accounting-supplier-invoice, accounting-supplier-payment]
summary: >-
  (TO-BE) Field opsional untuk total nominal di faktur fisik supplier. Jika
  diisi, sistem menghitung selisih ke Net Purchase Invoice dan — pada fase 1 —
  memposting selisih lebih besar ke Cash Diff saat approve.
version: 0.2
last_updated: 2026-07-27
status: review
---

# Supplier's Invoice Amount (**TO-BE**)

## Apa ini

Field opsional di **Basic Information** untuk menuliskan total yang tertera di **faktur fisik** supplier. Jika diisi, sistem menghitung **Invoice Diff** = amount tersebut dikurangi [Net Purchase Invoice](#sf-lingo:SF-TOT-01). Saat approve (fase 1 docs: selisih lebih besar), selisih masuk jurnal Cash Diff plus penyesuaian hutang.

> Status: **belum implementasi** di production — ikuti requirement TO-BE sebelum uji di staging/prod.

## Kapan dipakai

- Faktur supplier punya total yang sedikit berbeda dari Net sistem (mis. rounding di faktur kertas) — **bukan** selisih 1 sen jumlah manual DPP+VAT di layar (itu [DPP & VAT di detail](#sf-lingo:SF-PRICE-01)).
- Tim accounting ingin selisih tercatat jelas di jurnal, bukan “diseuaikan diam-diam”.
- Saat pelunasan di Account Payment sering tidak terima desimal — path Cash Diff / allocate full amount tetap relevan.

## Cara pakai (rencana TO-BE)

1. Isi detail PI sampai **Net Purchase Invoice** stabil.
2. Di Basic Information, isi **Supplier's Invoice Amount** sesuai faktur fisik (opsional).
3. Cek **Invoice Diff** yang dihitung sistem.
4. Pastikan **Cash Diff. COA** terisi di Internal Company jika diff tidak nol.
5. Approve PI — sistem memposting sesuai aturan fase (lihat Catatan).

## Catatan

- Prasyarat: jika field diisi dan diff ≠ 0, **Cash Diff. COA** di Internal Company harus ada.
- Fase 1 docs: fokus selisih **lebih besar** (supplier amount > net sistem). Kasus amount lebih kecil masih open di requirement.
- Account Payment: pelunasan sering tidak terima desimal — gunakan **Allocate Full Amount** agar sisa sen ikut clear bila perlu.

## Contoh

| Net sistem | Supplier's Invoice Amount | Invoice Diff | Saat approve |
|------------|---------------------------|--------------|--------------|
| 37.999.999,96 | 38.000.000 | +0,04 | Dr Cash Diff 0,04 / Cr AP 0,04 |
| 42.014.000 | *(kosong)* | — | Tidak ada post Cash Diff dari field ini |
| 42.014.000 | 42.000.000 | −14.000 | **Open** di requirement — belum dikunci fase 1 |

## Lihat juga

- [Net Purchase Invoice](#sf-lingo:SF-TOT-01)
- Requirement: [§5.1b](../requirement.md#51b-suppliers-invoice-amount-to-be--belum-implementasi), [§5.6b](../requirement.md#56b-jurnal-invoice-diff--cash-diff-to-be)
