# Journal — Knowledge Base

## Fungsi menu

**Journal** mencatat jurnal akuntansi (manual atau dari transaksi). Manual journal: header + ledger lines (debit/credit) + status Draft/Open/Approve.

## Route

- Datalist: `/accounting/journal`
- Create: `/accounting/journal/create` → auto-POST draft → redirect `/edit/{id}`
- Edit: `/accounting/journal/edit/:id`
- Ledger API: `accounting/journal-detail`

## Catatan AS-IS

- Store: PrimeVue MultiSelect `#store_id`, placeholder `Choose Store`, chip mode.
- Ledger inline: Account (`Choose Account`), `#debit_create`, `#credit_create`, Save (Tippy, icon button).
- `#open` / `#draft` auto-call `update(status)` — tidak perlu Save & Next setelah Open.
- Description wajib; automation: `automation playwright`.
- Butuh fiscal period Open yang cover Transaction Date.
