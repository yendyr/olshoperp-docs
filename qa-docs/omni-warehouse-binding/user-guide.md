---
doc_type: user-guide
menu: omni-warehouse-binding
menu_name: "Warehouse Binding"
version: 1.0
last_updated: 2026-10-09
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: "1.0"
owner: QA - Yemima
status: review
---

# Warehouse Binding — Panduan Pengguna

**Menu:** Omni → Warehouse Binding · **Route:** `/omni/warehouse-binding`

## Apa itu

Memetakan **gudang marketplace** ke **gudang sistem** OlshopERP. Tiga tipe: **Process**, **Stock**, **Return**.

## Kapan dipakai

- Store baru / sync warehouse platform selesai — bind sebelum fulfillment jalan.
- Ganti WH proses atau WH stok untuk store.

## Langkah Process binding

1. Pilih WH platform store.
2. Set tipe **Process** + pilih WH sistem (level ≤ 30).
3. Simpan — sistem bisa auto buat Stock binding + transfer wave tersembunyi + aktifkan Include ATS.

## Tips

- Process = 1 WH sistem per WH platform.
- Stock boleh multi WH.
- Return opsional.
- Binding Process salah → order bisa masuk WH yang tidak diharapkan.

Detail: [knowledge-base.md](./knowledge-base.md)
