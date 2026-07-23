# Purchase Invoice — Knowledge Base

## Fungsi menu

**Purchase Invoice** (Supplier Invoice) mencatat tagihan supplier dari inbound/PO yang sudah diterima.

## Route

- Datalist: `/accounting/supplier-invoice`
- Create → auto/manual Save & Next → `/edit/{id}`
- API: `accounting/supplier-invoice`

## Alur inbound

1. Header: Supplier → Save & Next
2. Klik teks **Inbound Transaction** → modal outstanding
3. Search PO / inbound → ceklis → **Use** (bulk POST details)
4. **Save All** header
