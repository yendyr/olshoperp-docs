---
doc_type: knowledge-base
menu: generalsetting-application
menu_name: "Application"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Application (General Settings) — Knowledge Base

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 1. Apa itu menu Application?

Menu **Application** mengatur **toggle dan default per company** (bukan global sistem). Satu halaman form (`Form.vue`) dengan beberapa section:

1. **Transaction list window** — berapa hari ke belakang data transaksi ditampilkan (`in_days`)
2. **Virtual warehouse void stock** — hitung void sebagai available stock
3. **Sales Order settings** — Instant Processing, Auto Approve (dan Process to Wave di backend meski sebagian UI di-comment)
4. Section tambahan di FE: Generate SO, global broadcast, Reverb stats (developer-oriented)

Settings disimpan per `owned_by = company_id` dari token login.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Render Transaction Limit** | Entity `gs_render_transaction_limits` — in_days, include_virtual_wh_void |
| **Order Process Setting** | `order_process_settings` — auto_approve, process_to_wave, instant_processing |
| **Instant Processing** | SO approved skip picking/checking/packing/outbound |
| **Auto Approve** | SO general auto-approved (durasi dari Omni Settings) |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Set hari tampilan datalist transaksi (kosong = all time from `getTransactionTimeLimit`)
- Toggle virtual void stock counting
- Toggle SO instant processing & auto approve (auto-save on change)
- Lihat audit log render transaction limit

### Tidak Bisa
- Ubah setting company lain (scoped owned_by)
- Process to Wave dari UI utama (commented) — masih ada API

## 4. Cara Pakai (How-To)

### Batas tampilan transaksi
1. Buka **General Setting → Application**.
2. Isi angka hari (mis. 45) → Save.
3. Datalist modul transaksi memakai cutoff via `getTransactionTimeLimit` API.

### Auto Approve SO
1. Aktifkan toggle **Auto Approve** — langsung POST ke order-process-setting.
2. Pastikan durasi auto-approve di **Omni Channel Settings** sudah diatur.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Data transaksi terlalu sedikit | in_days kecil | Naikkan hari atau kosongkan |
| Menu sidebar tidak update setelah save | Cache menu_build | Logout/login — cache cleared on save |
| Auto approve tidak jalan | Omni setting / order > 7 hari | Cek tooltip FE |

## 6. FAQ

**Q: Apa default jika in_days kosong?**
A: API `getTransactionTimeLimit` returns ~1 year back if no record.

**Q: Kenapa ada Reverb stats di halaman ini?**
A: AS-IS developer monitoring embedded in Application Form.vue.
