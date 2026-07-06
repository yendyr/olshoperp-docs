---
doc_type: knowledge-base
menu: accounting-supplier-payment
menu_name: "Account Payment"
version: 2.0
last_updated: 2026-07-05
owner: QA - Yemima
status: review
---

# Account Payment — Knowledge Base (Operator)

**Route:** `/accounting/supplier-payment`

---

## 1. Apa itu Account Payment?

Account Payment adalah transaksi **pembayaran ke supplier** untuk melunasi **Purchase Invoice** yang sudah approved.

**Kode:** `PAY-XXXXX`

---

## 2. Alur kerja

```
1. Accounting → Account Payment → Create
2. Pilih Supplier, Tanggal, Bank/Cash account, Mata Uang
3. Save → buka Outstanding Purchase Invoice
4. Pilih PI → isi jumlah bayar (≤ outstanding)
5. Save All → status Open → Approve
6. Jurnal: Dr Hutang (AP) Cr Bank
```

---

## 3. Outstanding Purchase Invoice

Panel menampilkan PI approved dengan sisa hutang > 0.

| Kolom penting | Arti |
|---------------|------|
| Net Purchase Invoice | Total tagihan PI |
| Outstanding | Sisa belum dibayar |
| To be paid | Sudah dialokasi di payment draft |

**Partial payment:** Boleh bayar sebagian; sisa PI tetap outstanding untuk payment berikutnya.

---

## 4. Hubungan dengan Purchase Invoice

| PI | Payment |
|----|---------|
| Approve → hutang tercatat | Alokasi → mengurangi outstanding |
| `grand_total_after_vat` | Amount yang dibayar per line |
| Status tetap Approved setelah dibayar | Payment Approved → jurnal bank |

**Rantai lengkap:**
1. **Inbound** — barang masuk, Unbilled Goods
2. **Purchase Invoice** — hutang + PPN
3. **Account Payment** — pelunasan ke bank

---

## 5. Troubleshooting

| Gejala | Solusi |
|--------|--------|
| PI tidak muncul outstanding | Pastikan PI approved; supplier sama; masih ada sisa hutang |
| Amount ditolak | Kurangi — tidak boleh > outstanding |
| PI sudah dibayar penuh | Outstanding = 0 — tidak perlu payment lagi |

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Purchase Invoice KB | [../accounting-supplier-invoice/knowledge-base.md](../accounting-supplier-invoice/knowledge-base.md) |
