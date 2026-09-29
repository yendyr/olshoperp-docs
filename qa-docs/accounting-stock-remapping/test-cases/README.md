# Stock Remapping — Test Cases

Menu: **Stock Remapping** (`/accounting/stock-remapping`)  
Prefix: `RM-`  
Maintenance owner: QA — Yemima  
Source requirement: [requirement.md](../requirement.md)

---

## Daftar Test Cases

| TC Code | Title | Type | Status | Card Ref | Automated | Last Run |
|---|---|---|---|---|---|---|
| TC-SRM-16113-01 | [Tampilan Informasi Total Amount dan Qty pada Datalist Stock Remapping](./TC-SRM-16113-01.md) | happy | active | [ETM-16113](https://erpintegration.atlassian.net/browse/ETM-16113) | ❌ | 2026-09-29 |
| TC-SRM-16113-02 | [Export With Details — Pemisahan Kolom Qty dan Total Amount serta Keberadaan Kolom Unit Price](./TC-SRM-16113-02.md) | happy | active | [ETM-16113](https://erpintegration.atlassian.net/browse/ETM-16113) | ❌ | 2026-09-29 |
| TC-SRM-16113-03 | [Export This Page Only — Pemisahan Kolom Gabungan Qty dan Total Amount](./TC-SRM-16113-03.md) | happy | active | [ETM-16113](https://erpintegration.atlassian.net/browse/ETM-16113) | ❌ | 2026-09-29 |
| TC-SRM-16113-04 | [Export Without Details — Pemisahan Kolom Total Remapping Quantity dan Total Amount](./TC-SRM-16113-04.md) | happy | active | [ETM-16113](https://erpintegration.atlassian.net/browse/ETM-16113) | ❌ | 2026-09-29 |
| TC-SRM-16113-05 | [Akurasi Akumulasi Total Amount pada Transaksi Multi-Item dengan Variasi Unit Price Ekstrem](./TC-SRM-16113-05.md) | edge | active | [ETM-16113](https://erpintegration.atlassian.net/browse/ETM-16113) | ❌ | 2026-09-29 |
| TC-SRM-16113-06 | [Validasi Tipe Data Numerik Kolom Qty dan Total Amount pada File Excel Hasil Export](./TC-SRM-16113-06.md) | edge | active | [ETM-16113](https://erpintegration.atlassian.net/browse/ETM-16113) | ❌ | 2026-09-29 |
| TC-SRM-16113-07 | [Integritas Alignment Kolom Export This Page Only Pasca Penyembunyian Kolom Datalist (Hide Column)](./TC-SRM-16113-07.md) | edge | active | [ETM-16113](https://erpintegration.atlassian.net/browse/ETM-16113) | ❌ | 2026-09-29 |

---

### ETM-16113 (Origin: ETM-16097)
Card perbaikan bug kolom gabungan Qty / Total Amount pada datalist Stock Remapping yang sebelumnya tidak terpisah menjadi 2 kolom di export (hilang di Without Details dan This Page Only), serta status Reopen di staging karena informasi Amount tidak muncul di datalist.
