# Test Cases — Failed Ship

### ETM-16071 — [Failed Ship] Optimasi Query Datalist Hanya Menampilkan Order Berelasi Reference Failed Ship

Origin Card: [ETM-16071](https://erpintegration.atlassian.net/browse/ETM-16071)

| Urutan | TC Code | Judul Test Case | Tipe | Jira Ref | File | Status |
|:---:|---|---|:---:|:---:|---|:---:|
| **01** | `TC-FS-16071-01` | [Datalist Failed Ship hanya memuat Sales Order yang sudah memiliki referensi dokumen Failed Ship](./TC-FS-16071-01.md) | `regression` | [ETM-16071](https://erpintegration.atlassian.net/browse/ETM-16071) | [`TC-FS-16071-01.md`](./TC-FS-16071-01.md) | PASSED 🟢 |
| **02** | `TC-FS-16071-02` | [Pengujian Kecepatan Loading Time Datalist Failed Ship (< 5 detik)](./TC-FS-16071-02.md) | `regression` | [ETM-16071](https://erpintegration.atlassian.net/browse/ETM-16071) | [`TC-FS-16071-02.md`](./TC-FS-16071-02.md) | PASSED 🟢 |
| **03** | `TC-FS-16071-03` | [Fungsionalitas Filter, Pencarian, dan Detail Dokumen Failed Ship Berjalan Normal](./TC-FS-16071-03.md) | `regression` | [ETM-16071](https://erpintegration.atlassian.net/browse/ETM-16071) | [`TC-FS-16071-03.md`](./TC-FS-16071-03.md) | PASSED 🟢 |

### ETM-16660 — [Failed Ship] Optimize Export All: batas 25.000 baris dan 5.000 baris per file

Origin Card: [ETM-16660](https://erpintegration.atlassian.net/browse/ETM-16660)

| Urutan | TC Code | Judul Test Case | Tipe | Jira Ref | File | Status |
|:---:|---|---|:---:|:---:|---|:---:|
| **01** | `TC-FS-001` | [Negative: Export All ditolak bila hasil filter lebih dari 25.000 baris atau masih ada export berjalan](./TC-FS-001.md) | `negative` | [ETM-16697](https://erpintegration.atlassian.net/browse/ETM-16697) | [`TC-FS-001.md`](./TC-FS-001.md) | draft (passed) |
| **02** | `TC-FS-002` | [Edge: Export All tepat 25.000 baris diterima dan hasil kosong tidak mengunci user](./TC-FS-002.md) | `edge` | [ETM-16698](https://erpintegration.atlassian.net/browse/ETM-16698) | [`TC-FS-002.md`](./TC-FS-002.md) | draft (passed) |
| **03** | `TC-FS-003` | [Regression: isi dan judul kolom Export All Failed Ship sama dengan datatable, angka murni bertipe angka, urutan baris tetap](./TC-FS-003.md) | `regression` | [ETM-16699](https://erpintegration.atlassian.net/browse/ETM-16699) | [`TC-FS-003.md`](./TC-FS-003.md) | draft (failed) |
