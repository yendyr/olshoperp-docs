---
doc_type: menu-capability
menu: supplychain-mutation-transfer-internal
id: SF-TFI-03
title: Relocate whole colli
aliases: [full colli transfer, pindah colli utuh, whole colli]
scope: menu
summary: >-
  Pindah seluruh isi colli ke lokasi baru dengan code colli sama — entry lewat
  Available Product + bulk Use; semua SKU dalam colli ikut; gagal jika masih reserved di transaksi lain.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Relocate whole colli

## Apa ini

Memindahkan **seluruh isi colli** (semua SKU dalam wadah yang sama) ke **satu lokasi baru**, dengan **kode colli tetap** — bukan hanya sebagian isi.

## Kapan dipakai

- Colli fisik pindah rak/lantai **tanpa** buka isi / pecah SKU.
- Semua qty sisa colli ikut — tidak ada sisa di lokasi lama.

## Cara pakai

1. Buka **Available Product**.
2. Pilih **semua baris** SKU yang share **Colli Code** sama → **Use** (bulk).
3. Set **Location Destination** ke lokasi baru (satu lokasi untuk semua baris).
4. **Colli Origin** = **Colli Destination** = code yang sama.
5. **Approve** — lokasi identitas colli di sistem = lokasi baru.

## Catatan

- Entry point wajib lewat **Available Product + bulk** (bukan hanya Select Product per SKU).
- Kalau ada qty colli yang masih **reserved** di **transaksi lain** → **Approve gagal** — colli tidak boleh punya dua lokasi.
- Sebagian isi saja? Pakai [Colli v2 (BETA)](#sf-lingo:SF-TFI-02) Flow assign biasa, bukan relocate whole.

## Contoh

COLLI001 @ RAK001: pensil 100 + buku 50. Transaksi lain reserve buku 2 pcs masih di COLLI001 @ RAK001.

| Aksi | Hasil |
|------|--------|
| TF pindah pensil 100 + buku 48 saja | **Tidak boleh** approve sebagai relocate whole COLLI001 |
| TF pindah semua qty + tidak ada reserve elsewhere | COLLI001 @ lokasi baru — OK |

## Lihat juga

- [Colli v2 (BETA)](#sf-lingo:SF-TFI-02)
- [Requirement §7.2b](../requirement.md)
