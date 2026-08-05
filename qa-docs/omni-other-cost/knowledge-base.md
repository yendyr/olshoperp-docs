---
doc_type: knowledge-base
menu: omni-other-cost
menu_name: "Other Cost"
version: 1.6
last_updated: 2026-08-04
owner: QA - Yemima
status: draft
---

# Other Cost — Knowledge Base

## Fungsi menu

Master **Other Cost** mendefinisikan biaya tambahan (shipping, packing, dll.) yang bisa dipakai di transaksi Omni/FA, dengan mapping ke **Expense COA** dan cakupan store.

## Route

- Datalist: `/omni/other-cost`
- Create: `/omni/other-cost/create`
- Edit: `/omni/other-cost/edit/:id`
- API: `omnichannel/other-cost`

## Field utama

| Field | Wajib | Catatan |
|-------|-------|---------|
| Code | Ya | Unik per company |
| Name | Ya | |
| Other Cost COA | Ya | Expense COA only (`Choose Other Cost COA`) |
| Applied Store / All Stores | Ya | Default **All Stores** |
| Description | Tidak | |
| Active | — | Toggle; inactive tidak bisa dipakai di transaksi |

## Catatan AS-IS

- Breadcrumb: FA → Master → Other Cost (route di bawah Omni).
- Edit: watcher `expense_coa_id` / `status` auto-save saat berubah.
- Tariff field di-comment di FE.

## Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Akun Other Cost tidak bisa dipilih — sudah dipakai Cash/Bank | Akun yang sama sudah terikat rekening Cash/Bank aktif di master | Pilih akun lain, atau hapus/nonaktifkan cash bank yang memakai akun itu (blokir penuh masih dalam penyiapan) |

## FAQ

**Q: Kenapa akun Other Cost tidak bisa dipilih karena sudah dipakai Cash/Bank?**  
A: Satu akun tidak boleh sekaligus jadi rekening Cash/Bank dan akun biaya Other Cost. Kalau rekening Cash/Bank yang memakai akun itu sudah dihapus, akun boleh dipilih lagi. Aturan blokir di picker dan saat simpan masih dalam penyiapan.
