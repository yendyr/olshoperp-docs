---
doc_type: menu-capability
menu: omni-unassign-wave
id: SF-UW-05
title: Send Wave Logs
aliases: [send wave logs, log send to default waves]
scope: menu
summary: >-
  Slideover / log riwayat kirim ke Default Wave: sukses, gagal, dan pesan error per order.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Send Wave Logs

## Apa ini

Riwayat aksi **Send to Default Waves** (single/bulk): siapa yang kirim, kapan, dan hasil per order.

## Kapan dipakai

- Melacak kenapa Send gagal.
- Audit batch kirim wave.
- Bandingkan dengan batch Skip Wave (pipeline berbeda, log terpisah).

## Cara pakai

1. Buka **Send Wave Logs** dari toolbar / aksi log di Unassign Wave.
2. Pilih entri log / batch.
3. Baca status sukses/gagal dan pesan error.
4. Perbaiki data → kirim ulang dari datalist (bukan dari log Import Skip Wave).

## Catatan

- Log ini untuk Unassign Wave → Default Wave, bukan Log Data Skip Wave Import.
- Order sukses biasanya sudah hilang dari datalist utama.

## Lihat juga

- [Send to Default Waves](#sf-lingo:SF-UW-01)
- Requirement: [§6.5 Send Wave Logs](../requirement.md)

