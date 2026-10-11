---
doc_type: knowledge-base
menu: supplychain-other-inbound
menu_name: "Other Inbound"
version: 2.0
last_updated: 2026-10-11
owner: QA - Yemima
status: review
audience: operator
aliases: [other inbound, inbound dari assembly]
---

# Other Inbound — Knowledge Base (Operator)

**Menu:** Supply Chain → Other Inbound  
**Route:** `/supplychain/other-inbound`

---

## 1. Apa itu?

Daftar **barang masuk gudang yang bukan dari Purchase Order**. Saat ini isinya hasil otomatis dari **Assembly** (finish goods). Tidak muncul di menu Purchase Inbound.

Halaman ini untuk **melihat / export** (dan print setelah tersedia). **Jangan** mengubah data di sini — ubah di **Assembly**.

---

## 2. Kapan muncul data?

| Situasi | Hasil |
|---------|--------|
| Assembly approve sukses | Baris inbound Approved, Trx Ref = Assembly |
| Generate Assembly bermasalah | Bisa ada status Open (untuk tracing) — tetap jangan diedit di sini |

---

## 3. Cara pakai

1. Buka Other Inbound.  
2. Cari / filter / buka dokumen (view).  
3. Export with atau without details bila perlu.  
4. Perlu koreksi qty/SKU → buka **Assembly** di Trx Ref.

🎬 [Interactive demo akan ditambahkan di sini]

---

## 4. Beda dengan Purchase Inbound

| | Other Inbound | Purchase Inbound |
|--|---------------|------------------|
| Sumber | Assembly (non-PO) | Purchase Order |
| Supplier | Tidak ada | Ada |
| Create manual | Tidak | Ya |

---

## 5. Troubleshooting

| Gejala | Cek |
|--------|-----|
| Data tidak muncul | Assembly sudah approve? WH FG benar? |
| Mau ubah qty | Ke Assembly, bukan menu ini |
| Bulk Delete/Approve masih ada | Known bug — jangan dipakai; [ETM-16440](https://erpintegration.atlassian.net/browse/ETM-16440) |
| Print belum jalan | Known gap — [ETM-16441](https://erpintegration.atlassian.net/browse/ETM-16441) |

---

## 6. FAQ

**Q: Bisa buat inbound di sini?** Tidak — hanya hasil sistem.  
**Q: Kenapa ada di Other bukan Purchase Inbound?** Tidak punya supplier / bukan dari PO.  
**Q: Export aman dari campur PI?** Ya — hanya data Other Inbound.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Assembly | [../supplychain-assembly/knowledge-base.md](../supplychain-assembly/knowledge-base.md) |
