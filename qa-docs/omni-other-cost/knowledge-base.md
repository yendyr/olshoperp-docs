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
