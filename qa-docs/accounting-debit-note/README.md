# Debit Note — Dokumentasi QA

Menu **Debit Note** (Accounting / Account Payable) — klaim/deposit ke supplier; dipakai potong hutang di Account Payment.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator, QA (Lingo index) | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo-style SF Entry | review |

**PM source:** Debit Note Source of Truth **v1.0** (12 Agustus 2026)  
**SoT:** [`_meta/sot/accounting-debit-note-source-of-truth.md`](../_meta/sot/accounting-debit-note-source-of-truth.md)  
**UI route:** `/accounting/debit-note`  
**3 layer version:** 1.1 · **User-guide:** 1.2 · **Feature Map:** 1.0 · **Last updated:** 2026-09-02  
**Maintenance owner:** QA — Yemima

**Help Center overview:** [ID](../_meta/docs-hub/menus/accounting-debit-note/overview.id.md) · [EN](../_meta/docs-hub/menus/accounting-debit-note/overview.en.md) (`authored` — not updated)

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-09-02 ~16:30 | 1.1 | Supplier tampil **kode saja** di daftar/form/export (cari by nama+kode; nama boleh di Print). Parent ETM-15721 / ETM-15727 |
| 2026-08-12 19:40 | HC 1.0 | Help Center overview ID + EN dari file authored user (Debit Note) |
| 2026-08-12 17:10 | 1.0b | Feature Map + 5 Lingo cards (SF-DN-01..04, SF-DET-01); UG v1.1 SF tags |
| 2026-08-12 | 1.0 | Full 5-file dari SoT v1.0; Gap GAP-DN-01..05; relasi AP/PR/PI/CN |

## Related menus

| Menu | Relasi |
|------|--------|
| [Account Payment](../accounting-supplier-payment/README.md) | DN approved = payment source potong hutang |
| [Purchase Return](../accounting-purchase-return/README.md) | Sumber DN billed retur |
| [Purchase Invoice](../accounting-supplier-invoice/README.md) | Hutang yang dilunasi AP |
| [Credit Note](../accounting-credit-note/README.md) | Mirror sisi AR |
| [Cash/Bank Account](../accounting-company-detail-bank/README.md) | Payment Source manual |
| [Journal](../journal/README.md) | Jurnal saat approve |
