# Fiscal Period — Knowledge Base

## Fungsi menu

Master **Fiscal Period** menentukan rentang tanggal aktif untuk transaksi FA. Transaksi hanya boleh jatuh pada period yang **Open**.

## Route

- Datalist: `/accounting/fiscal-period`
- Create: `/accounting/fiscal-period/create`
- Edit: `/accounting/fiscal-period/edit/:id`

## Field utama

| Field | Wajib | Catatan |
|-------|-------|---------|
| Name | Ya | Bebas, max 50 |
| Start Date / End Date | Ya | UI `dd-MM-yyyy`; API `yyyy-MM-dd` |
| Description | Tidak | Max 150 |

## Uniqueness

Tidak unik per nama/bulan. Backend menolak **overlap** tanggal: *"The selected date is already in use."*

## Target automation

Periode **Desember 2024**: Name `December 2024`, Start `01-12-2024`, End `31-12-2024`.
Idempotent: search dulu; create hanya jika belum ada period yang cover Dec 2024.
