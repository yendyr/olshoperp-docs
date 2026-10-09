---
doc_type: knowledge-base
menu: omni-checking-process
menu_name: "Checking Process"
version: 1.1
last_updated: 2026-10-09
owner: QA - Yemima
status: review
audience: operator
aliases: [Checking Process, transfer checking, approve checking]
---

# Checking Process — Knowledge Base

## Apa itu

Approve **transfer internal** tahap checking (virtual WH `sequence = 2`) setelah picking. Operator scan QR / kode TF / SO / platform order.

**Bukan** [Checking List](../omni-checking-list/README.md) — List = QC operasional (check, replace defective, scrap/replace TF). Process = approve dokumen TF stage.

## Alur

```mermaid
flowchart LR
  P[Picking Process approved] --> C[Checking Process approve]
  C --> PK[Packing Process / Packing List]
```

## Tips

- Picking harus sudah approved sebelum checking eligible.
- Settlement butuh rantai sampai **Shipped 3PL** — checking sendiri tidak memicu accounting.
- Relasi Failed Ship: tahap #2 (CL) di rantai fulfillment.

## Troubleshooting

| Gejala | Solusi |
|--------|--------|
| Transfer not found | Bukan destination sequence 2 / belum picking |
| Scanned previously | Sudah APPROVED — jangan scan ulang |

Detail: [requirement.md](./requirement.md) · [Checking List TO-BE](../omni-checking-list/requirement.md)
