---
doc_type: knowledge-base
menu: accounting-supplier-payment
menu_name: "Account Payment"
version: 2.1
last_updated: 2026-07-06
owner: QA - Yemima
status: review
---

# Account Payment — Knowledge Base (Operator)

**Audience:** Finance, AP clerk  
**Route:** `/accounting/supplier-payment`  
**Kode transaksi:** `PY-XXXXX`

---

## 1. Apa itu Account Payment?

Account Payment (AP) adalah transaksi **pembayaran hutang** ke supplier. Hutang berasal dari **Purchase Invoice** yang sudah approved.

Pembayaran bisa memakai:
- **Cash/Bank** — uang keluar dari rekening
- **Debit Note** — potongan tagihan (dari retur atau kelebihan bayar sebelumnya)
- **Kombinasi keduanya**

---

## 2. Alur kerja standar

```
1. Accounting → Account Payment → Create
2. Isi Supplier, Tanggal, Mata Uang, Kurs
3. Status Open
4. Section Payment Source → tambah Cash/Bank dan/atau Debit Note
5. Section Detail → Outstanding PI → pilih invoice → isi To Be Paid
6. (Opsional) Adjustment — biaya admin bank, rounding
7. Pastikan Total Source = Total Detail (harus balance)
8. Save All → Approve
```

**Penting:** Sebelum approve, **jumlah sumber dana harus sama persis** dengan jumlah alokasi PI.

---

## 3. Section Payment Source

### Cash / Bank
- Pilih rekening dari master
- **Balance** menampilkan saldo tersedia (dari jurnal approved)
- Amount tidak boleh melebihi saldo
- **Bulk Use** — isi otomatis saldo penuh per akun terpilih

### Debit Note
- Pilih DN approved milik supplier yang sama
- **Remaining Balance** = sisa DN yang bisa dipakai
- DN sedang dipakai payment lain → status Prepared/Processed di modal

---

## 4. Section Outstanding Purchase Invoice

| Kolom | Arti |
|-------|------|
| TOTAL | Net Purchase Invoice |
| OUTSTANDING | Sisa hutang |
| STATUS | Prepared = sedang di payment lain; Paid = lunas |
| PURCHASE RETURN | Link retur terkait (jika ada) |
| DEBIT NOTE | Link DN terkait PI (jika ada) |

**Use (single):** Modal → isi To Be Paid → Save  
**Allocate Full Amount:** Lunasi penuh sisa outstanding sekaligus  
**Bulk Use:** Tambah banyak PI sekaligus  

**Already Prepared:** PI sedang dipakai payment draft/open lain — tunggu approve/batalkan payment tersebut.

---

## 5. Section Detail & Totals

| Kolom | Arti |
|-------|------|
| Paid Amount | Nominal bayar (mata uang payment) |
| Exchange Diff. | Selisih kurs PI vs payment |
| Cash Diff | Selisih pembulatan saat full clearing |

**Balancing error:**  
*"Approval Failed. Total Payment Source must be equal to Total Payment Detail."*  
→ Sesuaikan amount di Source atau Detail.

---

## 6. Hubungan dengan menu lain

### Purchase Invoice
- PI approved muncul di outstanding
- Setelah AP approve → hutang PI berkurang (`processed_to_payment`)

### Debit Note
- DN bisa jadi **sumber dana** (ganti kas keluar)
- DN sering dari **Purchase Return** atau kelebihan bayar

### Purchase Return
- Retur barang → bisa generate DN
- DN dipakai di AP berikutnya sebagai potongan

### Cash / Bank
- Saldo rekening dari jurnal historis
- AP approve → **Credit** rekening bank di jurnal

---

## 7. Import massal

Datalist → **Import Log** → upload Excel 3 sheet (Bank Mutation · Detail · Adjustment).

- Hasil import status **OPEN** — review dulu sebelum approve
- Hanya **IDR** untuk import
- Satu proses import per company pada satu waktu

---

## 8. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Approve gagal balancing | Source ≠ Detail | Samakan total |
| Insufficient balance | Kas tidak cukup | Kurangi amount atau ganti rekening |
| PI tidak muncul | Sudah lunas / supplier beda / tanggal | Cek outstanding & filter |
| Header tidak bisa edit | Sudah ada detail | Hapus semua detail dulu |
| Void tidak jalan | MVP void belum aktif | Jangan approve jika belum yakin (GAP-PAY-VOID-01) |
| DN clearing bulk error | Bug URL FE | Pakai single DN add manual |

---

## 9. FAQ

**Q: Bisa bayar sebagian PI?**  
A: Ya — partial payment; sisa bisa dibayar di AP berikutnya.

**Q: Bisa gabung kas + debit note?**  
A: Ya — multiple rows di Payment Source.

**Q: Void payment approved?**  
A: PM MVP: **tidak tersedia**. UI void ada tapi tidak berfungsi dengan benar.

**Q: Due date PI?**  
A: Informasi di outstanding; tidak memblok payment.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Purchase Invoice | [../accounting-supplier-invoice/knowledge-base.md](../accounting-supplier-invoice/knowledge-base.md) |
| Debit Note | [../accounting-debit-note/knowledge-base.md](../accounting-debit-note/knowledge-base.md) |
