---
doc_type: knowledge-base
menu: omni-other-discount
menu_name: "Other Discount"
version: 1.3
last_updated: 2026-08-04
owner: QA - Yemima
status: draft
---

# Other Discount — Knowledge Base

## Fungsi menu

Master **Other Discount** mendefinisikan diskon tambahan yang bisa dipakai di transaksi Omni/FA, dengan mapping ke COA dan cakupan store.

## Route

- Datalist: `/omni/other-discount`
- Create: `/omni/other-discount/create`
- Edit: `/omni/other-discount/edit/:id`
- API: `omnichannel/other-discount`

## Field utama

| Field | Wajib | Catatan |
|-------|-------|---------|
| Code | Ya | Unik per company |
| Name | Ya | |
| Other Discount COA | Ya | `Choose Other Discount COA` |
| Applied Store / All Stores | Ya | Default create FE: **Applied Store** (`is_all_stores=false`) |
| Description | Tidak | |
| Active | — | Inactive tidak bisa dipakai di transaksi |

## Catatan AS-IS

- Breadcrumb: FA → Master → Other Discount (route Omni).
- Create default **bukan** All Stores — automation harus set All Stores atau pilih store.
- Edit: watcher COA/status kemungkinan auto-save (pola mirip Other Cost).

## Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Akun Other Discount tidak bisa dipilih — sudah dipakai Cash/Bank | Akun yang sama sudah terikat rekening Cash/Bank aktif di master | Pilih akun lain, atau hapus/nonaktifkan cash bank yang memakai akun itu (blokir penuh masih dalam penyiapan) |

## FAQ

**Q: Kenapa akun Other Discount tidak bisa dipilih karena sudah dipakai Cash/Bank?**  
A: Satu akun tidak boleh sekaligus jadi rekening Cash/Bank dan akun diskon Other Discount. Kalau rekening Cash/Bank yang memakai akun itu sudah dihapus, akun boleh dipilih lagi. Aturan blokir di picker dan saat simpan masih dalam penyiapan.
