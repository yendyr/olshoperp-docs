# Test Cases — Product Profit Loss

### ETM-15485 — [Product Profit Loss] Kalkulasi Gross Sales Berbasis Price Before VAT

| TC Code | Title | Status | Jira | Automated | Last Updated |
|---------|-------|--------|------|-----------|-------------|
| TC-PPL-001 | [E2E Kalkulasi Gross Sales Berbasis Price Before VAT pada Transaksi Tax Included](./TC-PPL-001.md) | approved | [ETM-15635](https://erpintegration.atlassian.net/browse/ETM-15635) | ✅ | 2026-08-21 |
| TC-PPL-002 | [E2E Kalkulasi Gross Sales Berbasis Price Before VAT pada Transaksi Tax Excluded](./TC-PPL-002.md) | draft | [ETM-15659](https://erpintegration.atlassian.net/browse/ETM-15659) | ❌ | 2026-08-26 |
| TC-PPL-003 | [Verifikasi Export Data dan Refresh Data Laporan Product Profit Loss Berbasis Price Before VAT](./TC-PPL-003.md) | draft | [ETM-15660](https://erpintegration.atlassian.net/browse/ETM-15660) | ❌ | 2026-08-26 |
| TC-PPL-15485-15833 | [Verifikasi Order tanpa Warehouse Process (Bypass Alur Gudang) Tidak Masuk ke Report](./TC-PPL-15485-15833.md) | **fail** | [ETM-15833](https://erpintegration.atlassian.net/browse/ETM-15833) | ❌ | 2026-09-24 |

### ETM-15857 — [Product Profit Loss] Gross Sales & Qty Sold inline dengan Outbound (selaras Total COGS)

Origin Card: [ETM-15857](https://erpintegration.atlassian.net/browse/ETM-15857)

| Urutan | TC Code | Judul Test Case | Tipe | Jira Ref | File | Status |
|:---:|---|---|:---:|:---:|---|:---:|
| **01** | `TC-PPL-15857-15990-01` | [SO Approved tanpa Outbound tidak pre-recognize Gross](./TC-PPL-15857-15990-01.md) | `regression` | [ETM-15990](https://erpintegration.atlassian.net/browse/ETM-15990) | [`TC-PPL-15857-15990-01.md`](./TC-PPL-15857-15990-01.md) | DRAFT 🟡 |
| **02** | `TC-PPL-15857-15991-02` | [Partial outbound Gross Qty COGS proporsional](./TC-PPL-15857-15991-02.md) | `happy` | [ETM-15991](https://erpintegration.atlassian.net/browse/ETM-15991) | [`TC-PPL-15857-15991-02.md`](./TC-PPL-15857-15991-02.md) | DRAFT 🟡 |
| **03** | `TC-PPL-15857-15989-03` | [SO Approved + Outbound Approved isi Gross Qty COGS bersama](./TC-PPL-15857-15989-03.md) | `happy` | [ETM-15989](https://erpintegration.atlassian.net/browse/ETM-15989) | [`TC-PPL-15857-15989-03.md`](./TC-PPL-15857-15989-03.md) | DRAFT 🟡 |
| **04** | `TC-PPL-15857-15992-04` | [Gross memakai Price Before VAT kali qty outbound](./TC-PPL-15857-15992-04.md) | `happy` | [ETM-15992](https://erpintegration.atlassian.net/browse/ETM-15992) | [`TC-PPL-15857-15992-04.md`](./TC-PPL-15857-15992-04.md) | DRAFT 🟡 |
| **05** | `TC-PPL-15857-15994-05` | [Retest Gross Before VAT setelah outbound penuh G-14](./TC-PPL-15857-15994-05.md) | `regression` | [ETM-15994](https://erpintegration.atlassian.net/browse/ETM-15994) | [`TC-PPL-15857-15994-05.md`](./TC-PPL-15857-15994-05.md) | DRAFT 🟡 |
| **06** | `TC-PPL-15857-15995-06` | [Export Excel Detail Orders Refresh selaras datalist](./TC-PPL-15857-15995-06.md) | `happy` | [ETM-15995](https://erpintegration.atlassian.net/browse/ETM-15995) | [`TC-PPL-15857-15995-06.md`](./TC-PPL-15857-15995-06.md) | DRAFT 🟡 |
| **07** | `TC-PPL-15857-15993-07` | [Outbound tanpa ref SOD tidak masuk Gross COGS](./TC-PPL-15857-15993-07.md) | `edge` | [ETM-15993](https://erpintegration.atlassian.net/browse/ETM-15993) | [`TC-PPL-15857-15993-07.md`](./TC-PPL-15857-15993-07.md) | DRAFT 🟡 |
| **08** | `TC-PPL-15857-15996-08` | [Order General dan Platform perilaku Gross Outbound sama](./TC-PPL-15857-15996-08.md) | `cross-menu` | [ETM-15996](https://erpintegration.atlassian.net/browse/ETM-15996) | [`TC-PPL-15857-15996-08.md`](./TC-PPL-15857-15996-08.md) | DRAFT 🟡 |

### ETM-16059 — [Product Profit Loss] Qty Sold dan Gross Sales Mengembang 100x pada SKU Non-Base Unit

Origin Card: [ETM-16059](https://erpintegration.atlassian.net/browse/ETM-16059)

| Urutan | TC Code | Judul Test Case | Tipe | Jira Ref | File | Status |
|:---:|---|---|:---:|:---:|---|:---:|
| **01** | `TC-PPL-16059-01` | [Kalkulasi Qty Sold dan Gross Sales pada SKU Non-Base Unit (1 Box = 10 Pcs) Tidak Mengembang 100x](./TC-PPL-16059-01.md) | `regression` | [ETM-16059](https://erpintegration.atlassian.net/browse/ETM-16059) | [`TC-PPL-16059-01.md`](./TC-PPL-16059-01.md) | DRAFT 🟡 |
| **02** | `TC-PPL-16059-02` | [Akurasi kalkulasi Total COGS dan Net Profit pada SKU dengan unit konversi](./TC-PPL-16059-02.md) | `regression` | [ETM-16059](https://erpintegration.atlassian.net/browse/ETM-16059) | [`TC-PPL-16059-02.md`](./TC-PPL-16059-02.md) | DRAFT 🟡 |
| **03** | `TC-PPL-16059-03` | [Verifikasi regenerasi snapshot data via tombol Refresh Data pada periode transaksi](./TC-PPL-16059-03.md) | `regression` | [ETM-16059](https://erpintegration.atlassian.net/browse/ETM-16059) | [`TC-PPL-16059-03.md`](./TC-PPL-16059-03.md) | DRAFT 🟡 |
| **04** | `TC-PPL-16059-04` | [Regresi kalkulasi SKU standar dengan Base Unit (Pcs rasio 1:1) tetap normal](./TC-PPL-16059-04.md) | `regression` | [ETM-16059](https://erpintegration.atlassian.net/browse/ETM-16059) | [`TC-PPL-16059-04.md`](./TC-PPL-16059-04.md) | DRAFT 🟡 |



