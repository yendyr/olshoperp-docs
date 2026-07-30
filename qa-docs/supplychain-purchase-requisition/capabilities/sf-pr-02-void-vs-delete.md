---
doc_type: menu-capability
menu: supplychain-purchase-requisition
id: SF-PR-02
title: Void vs Delete
aliases: [void PR, delete PR, batalkan requisition]
scope: menu
summary: >-
  Hapus PR Draft/Open dengan Delete. Void hanya untuk PR Approved
  yang belum diproses ke jalur selesai. Rejected tidak bisa dihapus.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Void vs Delete

## Apa ini

Dua cara menghentikan dokumen PR tergantung status. **Delete** untuk yang masih disusun. **Void** untuk yang sudah **Approved** tetapi dibatalkan.

## Kapan dipakai

| Aksi | Pakai jika |
|------|------------|
| **Delete** | Status **Draft** atau **Open** |
| **Void** | Status **Approved** |
| Tidak delete | **Rejected** — perbaiki lalu set Open, atau biarkan |

## Cara pakai

1. Cek status di datalist.
2. Draft/Open → **Delete** (termasuk bulk delete jika eligible).
3. Approved → **Void**.
4. Setelah Reject: edit → sering jadi Draft → set **Open** → Approve ulang (bukan Delete Rejected).

## Catatan

- Delete **tidak** tersedia untuk Rejected / Approved / Processed / Complete / Closed / Void.
- Duplicate membuat PR baru **Draft** (kode baru, tanpa lampiran) — bukan Void.
- Setelah Processed/Complete/Closed, jangan harapkan Delete/Void sebagai cara “undo” ke outstanding — ikuti aturan PO/PR terkait.

## Contoh

| Status | Aksi benar |
|--------|------------|
| Open | Delete atau Approve |
| Approved | Void (jika batalkan) |
| Rejected | Edit + set Open — bukan Delete |
| Processed | Closed (stop sisa) — bukan Void |

## Lihat juga

- [Complete vs Closed](#sf-lingo:SF-PR-01)
- Knowledge Base: [§5 Tombol & fungsi UI](../knowledge-base.md)
