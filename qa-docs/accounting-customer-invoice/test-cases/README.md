# Test Cases — Sales Invoice (Customer Invoice)

Dokumentasi test case untuk menu **Sales Invoice** (`/accounting/customer-invoice`).

---

## Daftar Test Case

### General & Core Features

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-SINV-001` | CREATE — Customer Supplier China + Outstanding SO SKUSINGLE-194/195 + Approve | [`TC-SINV-001.md`](./TC-SINV-001.md) | APPROVED 🟢 |

---

### ETM-16092 — [Sales Invoice] Export With/Without Details (Total Other Cost, Discount, Instant Settlement, Description)

Origin Card: [ETM-16092](https://erpintegration.atlassian.net/browse/ETM-16092)

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-SINV-16092-01` | T01: Export Sales Invoice Mode Without Details & With Details (Verifikasi 4 Kolom Baru & Data Integrity) | [`TC-SINV-16092-01.md`](./TC-SINV-16092-01.md) | PASSED 🟢 |
| `TC-SINV-16092-02` | T02: Export With/Without Details Saat Kolom Dihide di Datalist (Fixed Backend Template Integrity) | [`TC-SINV-16092-02.md`](./TC-SINV-16092-02.md) | PASSED 🟢 |
