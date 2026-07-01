---
doc_type: knowledge-base
menu: supplychain-cancelled-order
menu_name: "Cancelled Order"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Cancelled Order — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Cancelled Order?

**Cancelled Order** adalah menu **monitoring read-only** yang menampilkan Sales Order berstatus **Rejected** atau **Void** — order yang dibatalkan dari platform, ditolak internal, atau di-void operator. Bukan menu untuk membuat pembatalan; data berasal dari alur Sales Order / OmniChannel.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Cancelled Order |
| Route UI | `/supplychain/cancelled-order` |
| API | `GET supplychain/cancelled-order` (index only) |
| Sumber data | `omni_sales_orders` (filter status) |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Void | SO dibatalkan (`transaction_status = void`) |
| Rejected | SO ditolak approval (`transaction_status = rejected`) |
| Platform Order ID | Nomor order marketplace |
| Processing Status | Tahap terakhir picking/checking/packing sebelum batal |
| Void Notes | Catatan void — `cancelled from platform` jika `approved_by = 0` |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- Melihat datalist SO void/rejected dengan filter SearchBuilder
- Klik link SO code → buka form edit SO (Omni atau Sales Order General)
- Melihat platform, customer/store, payment deadline, status platform
- Melihat tanggal create vs tanggal void/reject
- Melihat processing status terakhir (Picking/Checking/Packing/Approved Order)

### Tidak Bisa

- Create, edit, atau void SO dari menu ini (read-only)
- Row action / approve dari datalist (`action_button: false`)
- Export dari menu ini (tidak exposed di controller index)

## 4. Cara Pakai (How-To)

### Monitor order batal

1. Buka **Cancelled Order**.
2. Gunakan filter kolom (SO code, platform order, customer, status, dll.).
3. Klik **SO code** untuk investigasi detail di form Sales Order asal.

### Interpretasi kolom

| Kolom | Arti |
|-------|------|
| SO Code / Platform Number | Identitas internal + marketplace |
| Platform | Channel (Shopee, Tokopedia, dll.) |
| Customer / Store | Buyer atau nama toko |
| Payment / Deadline | Waktu bayar vs deadline kirim |
| Transaction Status | void / rejected |
| Created / Void-Reject Date | Kapan order masuk vs kapan dibatalkan |
| Processing Status | Sejauh mana order sempat diproses gudang |
| Void Notes | Alasan/catatan pembatalan |

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| SO tidak muncul | Status bukan void/rejected | Cek status di Sales Order |
| Customer name `-` | Bug render saat `customer` relation ada | Lihat store/buyer column atau buka SO detail |
| Link SO salah modul | `type_sales_order = general` | Redirect ke Business Development SO General |

## 6. FAQ

**Q: Bagaimana order masuk ke list ini?**  
A: Otomatis saat SO di-void/reject via Omni approval, platform webhook, atau operator.

**Q: Apakah bisa restore order dari sini?**  
A: Tidak — buka SO asal jika ada alur reopen (tergantung status & hak akses modul SO).

## 7. Relasi Menu

| Menu | Hubungan |
|------|----------|
| Sales Order (Omni) | Sumber data & edit link |
| Sales Order General | Edit link untuk tipe general |
| Picking / Checking / Packing | Processing status derivation |
| Failed Ship / Waves | Tidak langsung — investigasi downstream |

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
