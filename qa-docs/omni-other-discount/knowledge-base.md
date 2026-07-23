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
