---
doc_type: knowledge-base
menu: businessdevelopment-variable-price
menu_name: "Variable Price"
version: 0.1
last_updated: 2026-10-07
owner: QA - Yemima
status: draft
aliases: [Variable Price, master margin, margin by weight, margin by amount]
---

# Variable Price — Knowledge Base

## Apa itu

Master aturan margin. Pilih **berdasarkan harga** atau **berdasarkan berat** — satu master hanya salah satu. Kalau butuh keduanya, buat dua master lalu pasang di Category Price.

## Alur

```mermaid
flowchart TD
    A[Buat Variable Price + isi band] --> B[Pasang di Category Price]
    B --> C{Ubah master lagi?}
    C -->|Ya| D[Update to Category — konfirmasi]
    D --> E[Lanjut Update Pricelist dari Category jika perlu]
```

## Tips

- Value boleh minus (mengurangi harga jual).
- Ubah master tidak langsung mengubah harga jual — ada dua pintu konfirmasi (Category, lalu Pricelist).
