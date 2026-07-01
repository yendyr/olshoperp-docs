---
doc_type: knowledge-base
menu: journal
menu_name: "Journal"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, types, lifecycle, manual-entry, faq]
---

# Journal — Knowledge Base

## 1. Apa itu Journal?

Menu untuk mencatat **transaksi jurnal akuntansi** — manual oleh user atau otomatis dari transaksi lain (invoice, payment, stock adjustment, dll.).

**Menu:** FA → Journal (`/accounting/journal`)

Hanya journal **Approved** yang masuk laporan keuangan (GL, Trial Balance, Balance Sheet, P&L).

## 2. Tipe journal (kolom Type)

| Type | Asal |
|------|------|
| Manual Journal Entry | User buat manual |
| Sales Invoice | Dari sales invoice |
| Purchase Invoice | Dari purchase invoice |
| Payment from Customer | AR / penerimaan piutang |
| Payment to Supplier | Pembayaran ke supplier |
| Warehouse Stock Inbound/Outbound | Inbound PO / outbound gudang |
| Stock Adjustment (Addition/Deduction) | Stock addition / deduction |
| Assembly Inbound | Assembly stock in |
| Credit Note / Debit Note | Nota kredit/debit |
| Purchase Return | Retur pembelian |

**Trx Ref** menunjuk ke dokumen langsung yang memicu journal (bukan transaksi paling upstream).

## 3. Status lifecycle

```
DRAFT → OPEN → APPROVED
             ↘ REJECTED
```

| Status | Arti |
|--------|------|
| Draft | Baru dibuat / sedang diedit |
| Open | Siap di-approve |
| Approved | Final — masuk laporan |
| Rejected | Ditolak; edit ulang → kembali Draft |

Journal auto-generate dari sistem langsung **Approved**.

## 4. Membuat journal manual

1. Klik **Create** — isi Basic Information + Ledger Detail dalam satu halaman
2. **Wajib:** Transaction Date (dalam fiscal period aktif), Currency, Description, minimal 1 baris detail
3. Setiap baris detail: pilih **COA child** (bukan parent), isi Debit **atau** Credit
4. Total Debit harus = Total Credit sebelum approve
5. **Approve** dari sidebar kanan

### Field penting

| Field | Catatan |
|-------|---------|
| Transaction Date | Harus dalam fiscal period aktif |
| Currency | Primary = rate 1 (disabled); foreign = input exchange rate |
| Store | Opsional — store Platform & Others aktif |
| Ledger Detail | Hanya COA terkecil (child) |

## 5. Export & Import

- **Export Basic:** halaman aktif saja, header saja
- **Export Advanced:** sesuai filter; opsi with/without detail
- **Import:** lihat requirement.md §7 untuk format template

## 6. FAQ

**Q: Kenapa tidak bisa save?**  
A: Cek fiscal period aktif untuk transaction date; pastikan debit = credit.

**Q: Bisa edit journal approved?**  
A: Tidak — approved adalah final untuk laporan keuangan.

**Q: Journal otomatis dari mana?**  
A: Saat approve transaksi terkait (invoice, payment, outbound, stock adjustment, dll.) — termasuk **Instant Settlement** (SI + OB + AR batch).

Detail settlement: [Instant Settlement](../accounting-settlement-upload/requirement.md)
