# Instant Settlement — Dokumentasi

Menu **Instant Settlement** (Accounting) — juga dikenal sebagai Upload Settlement, Settlement Order, atau Platform Settlement.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) (v2.4) | Operator | review |
| Requirement | [requirement.md](./requirement.md) (v2.4) | PM, QA | review |
| Technical | [technical.md](./technical.md) (v2.4) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) (v2.3) | Publish eksternal | review |
| Feature Map | [feature-map.md](./feature-map.md) (v1.1) | Operator (Lingo index) | review |
| Capability Lingo | [capabilities/](./capabilities/) | Operator (modal cards) | review |

**UI route:** `/accounting/settlement-upload`  
**Note (2026-11-04):** Batch macet [ETM-16911](https://erpintegration.atlassian.net/browse/ETM-16911) direvisi: tombol **Stop Generating** manual setelah 1 jam tanpa kemajuan + Delete (revert); hitungan progres tidak berlipat. Pemantau otomatis dicabut.  
**Note (2026-11-04):** Upload toko milik company lain harus ditolak sejak awal — [ETM-17057](https://erpintegration.atlassian.net/browse/ETM-17057). Kalau pembacaan file gagal, batch jadi Failed dan antrean company lain tetap jalan.  
**Note (2026-11-04):** Panel Sales Invoice: Net Sales SO sebelum PPN ([ETM-16871](https://erpintegration.atlassian.net/browse/ETM-16871)); Net Sales SI dan Difference SO-SI menyusul sebelum PPN + tooltip header — [ETM-17052](https://erpintegration.atlassian.net/browse/ETM-17052).  
**Note (2026-10-29):** Antrean **In Queue** (1 generate global + jeda 10 menit) — [ETM-16060](https://erpintegration.atlassian.net/browse/ETM-16060) QA Review; penyempurnaan [ETM-16910](https://erpintegration.atlassian.net/browse/ETM-16910) / stuck [ETM-16911](https://erpintegration.atlassian.net/browse/ETM-16911); SI kosong [ETM-16895](https://erpintegration.atlassian.net/browse/ETM-16895) Done.  
**Note (2026-09-23):** Shopee Instant Settlement pakai format **Penghasilan** — [ETM-16058](https://erpintegration.atlassian.net/browse/ETM-16058).  
**Note (2026-09-09):** Delete/Revert AR luar vs IS — [ETM-15886](https://erpintegration.atlassian.net/browse/ETM-15886).  
**Help Center overview:** belum ada di `_meta/docs-hub/menus/accounting-settlement-upload/` (skip sampai dibuat).  
**TO-BE plan (terpisah):** [Platform Generate API→CSV→batch](../../superpowers/plans/2026-10-28-instant-settlement-platform-generate.md) — belum di layer requirement sampai implementasi.

**Menu terkait (Fase 1):** [Settlement Mapping](../accounting-settlement-mapping/README.md) · [Store](../omni-store-binding/README.md) · [Outbound](../supplychain-mutation-outbound/README.md) · [Sales Invoice](../accounting-customer-invoice/README.md) · [Account Receive](../accounting-customer-payment/README.md) · [Failed Ship](../supplychain-failed-ship/README.md) · [Other Cost](../omni-other-cost/README.md) · [Other Discount](../omni-other-discount/README.md)  
**Acuan antrean:** [Skip Wave Process](../omni-skip-wave-process/README.md)

## Changelog

| Date | Changes |
|------|---------|
| 2026-11-04 16:45 | v2.4 TO-BE batch macet ETM-16911 direvisi: tombol Stop Generating setelah 1 jam tanpa kemajuan, Delete untuk bersihkan data setengah jadi |
| 2026-11-04 11:20 | v2.3 upload toko milik company lain ditolak sejak awal; kalau pembacaan file gagal, batch jadi gagal dan antrean lanjut; batch yang macet bisa dihapus atau diulang (ETM-17057). Ulang proses (Retry) tetap bisa setelah file asli terhapus, dan ditolak dengan pesan jelas kalau ada file lain yang sedang diproses (ETM-16910) |
| 2026-11-04 | v2.2 definisi kolom panel Sales Invoice (sebelum PPN) + tooltip header ETM-17052 |
| 2026-10-29 | v2.1 antrean In Queue ETM-16060 + TO-BE 16910/16911 + guard 16895 |
| 2026-10-22 | v2.0 ETM-16763 OC/OD SI settlement |
| 2026-09-28 | Feature Map + Lingo cards |
| 2026-09-23 | Shopee Penghasilan ETM-16058 |
| 2026-09-09 | Delete/Revert ETM-15886 |
| 2026-09-01 | Approve same calendar date ETM-15701 |

**Maintenance owner:** QA — Yemima
