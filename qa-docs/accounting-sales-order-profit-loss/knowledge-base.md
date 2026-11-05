---
doc_type: knowledge-base
menu: accounting-sales-order-profit-loss
menu_name: "Sales Order Profit Loss"
version: 1.0
last_updated: 2026-11-05
owner: QA - Yemima
status: review
audience: operator
---

# Sales Order Profit Loss — Knowledge Base

**Route:** `/accounting/sales-order-profit-loss`  
**Modul:** Accounting → Report

---

## Apa ini?

Laporan **laba/rugi per Sales Order** (plus ringkasan harian / store / platform + chart). Dipakai Finance untuk melihat berapa P/L order di periode tertentu, dengan COGS dari outbound gudang.

---

## Yang bisa dilakukan

| Aksi | Keterangan |
|------|------------|
| Pilih periode tanggal | Chart & tabel ikut berubah |
| Filter platform / store | Mempersempit data |
| Baca chart | Tren harian P/L, donut per platform & store |
| Baca tabel harian / store / platform | Agregat qty, COGS, SO, SI, P/L, % |
| Baca tabel berjudul **Daily Total P/L in Period per Store** | **Satu baris = satu nomor Sales Order** (bukan agregat store) |

---

## Arti angka penting

| Kolom | Artinya |
|-------|---------|
| Total SO | Nilai net Sales Order |
| Total SI | Nilai net Sales Invoice |
| Total COGS | HPP dari outbound `OT-…` yang terkait baris order |
| Total P/L | Total SI dikurangi Total COGS |
| % P/L | Persentase P/L terhadap Total SI |

Kalau order belum punya outbound: **COGS = 0**, P/L = Total SI.

---

## TO-BE (ETM-17074) — kolom Outbound

Di tabel yang menampilkan **nomor SO**, akan ditambah:

- **Trx. Code Outbound** — nomor outbound terkait order  
- **Trx. Date Outbound** — tanggal outbound tersebut  

Supaya operator langsung lihat referensi gudang tanpa buka menu Outbound terpisah.

Belum outbound → kolom outbound kosong / `-`.

---

## Yang tidak bisa

- Edit / approve transaksi dari menu ini (read-only report)
- Mengganti rumus COGS manual
- Melihat P/L per SKU di sini → pakai **Product Profit Loss**
- Melihat P/L akun (COA) → pakai **Profit & Loss**

---

## Troubleshooting singkat

| Gejala | Cek |
|--------|-----|
| Tabel kosong | Periode & filter store; pastikan ada SO Approved/Processed |
| COGS 0 tapi order sudah kirim | Apakah outbound `OT-…` sudah ada & terhubung ke detail SO? |
| P/L aneh | Bandingkan Total SI vs COGS; cek % edge SI = 0 |

---

## Related

- Requirement: [requirement.md](./requirement.md)  
- Card: [ETM-17074](https://erpintegration.atlassian.net/browse/ETM-17074)
