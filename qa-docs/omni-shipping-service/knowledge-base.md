---
doc_type: knowledge-base
menu: omni-shipping-service
menu_name: "Master Shipping Service"
version: 1.1
last_updated: 2026-06-28
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting, ui-buttons]
---

# Master Shipping Service — Knowledge Base

> **Status: DRAFT** — v1.1 (2026-06-28). Termasuk deep-check approve vs Send to Default Wave.

## 1. Apa itu Master Shipping Service?

Menu **Master Shipping Service** (`/omni/shipping-service`) mendefinisikan **standar internal** jenis pengiriman per shipper (misal: `Regular J&T Drop-Off`), termasuk batas berat/dimensi paket. Standar ini kemudian di-**binding** ke nama shipping service dari marketplace (Shopee, TikTok, Lazada, dll.) yang penamaannya berbeda-beda.

Tanpa binding, order platform tidak bisa diproses dengan benar menuju gudang shipper (3PL).

### Masalah yang diselesaikan

| Platform | Contoh nama sama (J&T reguler drop-off) |
|----------|----------------------------------------|
| Tokopedia | `reg jnt (drop-off)` |
| Shopee | `REG j&t (drop-off)` |
| TikTok | `regular jnt (drop-off)` |
| Lazada | `Regular J&T (drop-off)` |

OlshopERP menyatukan ke **1 nama internal** + 1 konfigurasi weight/dimension.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Master Shipping Service | Data standar internal (`omni_shipping_services`) |
| Platform Shipping Service | Data mentah dari API marketplace — menu terpisah |
| Shipper Name | General Company yang Recognize As **Shipper** |
| Shipper Service | Nama layanan internal (field `name`) |
| Service Type | **Drop Off** atau **Pick Up** |
| Binding | Relasi master ↔ platform shipping service |
| Binding Status | **Binded** / **Not Binded** di DataList |
| Default Shipping Service | Master yang auto-terisi saat create Sales Order General |
| Show for All Company | Data Public — visible ke company lain (toggle) |
| WH Shipper | Gudang 3PL shipper — dilihat via side menu Warehouse Shipping |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- Create/edit master shipping service (code, shipper, weight, dimension, toggles)
- Binding multi-select ke Platform Shipping Service (mode edit)
- Export Excel With/Without Details (background job)
- Lihat audit log perubahan
- Lihat struktur Warehouse Shipper terkait master
- Set satu default shipping service per company
- Bulk delete master (jika tidak dipakai transaksi)

### Tidak Bisa

- **Import Excel** create/update master — fitur tidak tersedia
- Binding saat create — section binding muncul setelah data tersimpan
- Binding jika company belum punya Store sebagai **default owner data**
- Bind 1 platform shipping service ke 2 master berbeda (same company)
- Edit Service Type setelah data dibuat
- Hapus master yang sudah dipakai Sales Order
- Edit data milik company lain (read-only)
- Print detail — tombol print menampilkan pesan belum tersedia
- Pakai Logistic Label Template — belum fungsional (opsi kosong)

## 4. Cara Pakai (How-To)

### 4.1 Setup awal (recommended flow)

1. Pastikan **General Company** shipper sudah Active.
2. Sync **Platform Shipping Service** (menu terpisah) untuk Shopee/TikTok.
3. **Omni Channel → Settings → Master Shipping Service → Create**
4. Isi Basic Information → **Save All** → redirect ke edit.
5. Section **Shipping Binding** → pilih platform services → **Save All**.
6. Ulangi untuk semua variasi shipper platform yang dipakai toko.

### 4.2 Set default untuk Sales Order General

1. Edit master yang diinginkan.
2. Aktifkan toggle **Set as Default Shipping Service**.
3. **Save All** — default lama otomatis non-default.

### 4.3 Cek binding status dari DataList

- Badge **Binded** (hijau): sudah ada relasi platform.
- Badge **Not Binded** (kuning): perlu binding sebelum order bisa diproses normal.
- Icon ⚠️: master weight/dimension **lebih besar** dari platform ter-binding — review konfigurasi.

## 5. UI — Tombol & Navigasi

### DataList

| Tombol | Fungsi |
|--------|--------|
| **Create** | Form create master baru |
| **Show Deleted** | Tampilkan/sembunyikan data terhapus |
| **Export All** | Panel export; pilih With/Without Details |
| **Bulk delete** | Hapus banyak record terpilih |
| **Action per row** | Edit / Delete / Restore |

### Form (side navigation)

| Item | Fungsi |
|------|--------|
| **Basic Information** | Scroll ke section form utama |
| **Shipping Binding** | Scroll ke binding (edit only) |
| **Warehouse Shipping** | Slideover tree gudang shipper |
| **Audit Log** | Slideover riwayat perubahan |
| **Save All** | Simpan semua perubahan |
| **Print** | Belum tersedia (toast error) |

## 6. Export Excel (bukan Import)

Master Shipping Service hanya support **export**, bukan import.

### Cara export

1. Buka DataList → panel **Export All** (slider).
2. Pilih **With Details** atau **Without Details**.
3. Tunggu job selesai di Export File Table (poll progress otomatis).
4. Download file Excel.

### Opsi & kolom

| Opsi | Isi file |
|------|----------|
| **With Details** | 18 kolom — master + 1 baris per platform binding |
| **Without Details** | 15 kolom — master saja (platform columns `-`) |

**15 kolom inti:** Code, Name, Shipper, Shipping Service Type, Length, Width, Height, Weight (max), Min Weight, Insurance Available, Default Shipping Service, Status, Description, Created By, Created At.

**+3 kolom With Details:** Platform Name, Platform Shipping Service Code, Platform Shipping Service Name.

Detail lengkap alur job & format: [requirement.md §6](./requirement.md).

## 7. Order tanpa binding — apa yang terjadi?

| Tahap | Tanpa binding |
|-------|---------------|
| **Approve manual** | Bisa **sukses** (status Approved) — config sistem default |
| **Flag error** | Muncul beberapa detik setelah approve (icon truck / shipping-error) |
| **Send to Default Wave** | **Gagal** — order tidak masuk proses gudang |

Intinya: order **tidak lolos ke gudang** selama binding belum ada, meskipun status sudah Approved.

## 8. Data Platform (sync — menu terpisah)

Data shipping marketplace **tidak** di-import lewat menu ini. Operator sync dari **Platform Shipping Service**:

| Platform | Sync otomatis? |
|----------|----------------|
| Shopee | ✅ Sync All (menu Platform Shipping Service) |
| TikTok Shop | ✅ Sync All |
| Lazada | ❌ **Belum ada** — data manual/seeder; lihat requirement §6B.2 untuk task dev |
| Tokopedia | Deprecated |

## 9. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Order Approved tapi tidak masuk wave | Shipper belum binding | Binding master; ulangi Send to Default Wave dari Unassign Wave |
| Order tidak bisa approve / ada flag shipping | Platform service belum di-binding ke master | Binding di edit master; pastikan platform sudah di-sync |
| Error saat binding | Platform sudah ter-binding ke master lain | Lepas binding lama atau pilih platform lain |
| "Binding failed... default owner data store" | Company bukan default owner di Store | Set Store dengan default owner = company Anda |
| Warning ⚠️ di DataList | Master weight/dimension > platform bound | Turunkan master atau cek data platform |
| Default SO General tidak terisi | Belum set default / master inactive | Set toggle Default; pastikan Active ON |
| Shipper Name kosong/tidak bisa dipilih | Tidak ada General Company shipper Active | Aktifkan shipper di General Company |
| Export lama | Job queue backlog | Tunggu; cek Horizon; refresh Export File Table |
| Tidak bisa edit toggle Public | Data milik company lain | Normal — hanya owner yang bisa edit |

## 10. FAQ

**Q: Approve sukses tapi ada flag shipping-error — apakah order sudah masuk gudang?**  
A: **Belum.** Order status Approved tetapi belum masuk wave. Wajib binding dulu, lalu Send to Default Wave.

**Q: Kenapa nama shipper di order beda dengan platform?**  
A: Jika sudah binding, sistem tampilkan **nama master internal**, bukan nama platform mentah.

**Q: Kenapa order tidak bisa approve?**  
A: Salah satu penyebab: shipping belum binding. Di environment default, approve bisa sukses dulu lalu muncul **flag error** — cek kolom error di datalist order.

**Q: Bisa 1 nama platform Shopee sama ke 2 master?**  
A: Tidak, **per company**. Company berbeda boleh punya binding berbeda ke nama platform serupa.

**Q: Apakah data platform ditarik per store?**  
A: Tidak. Sync per **platform** (satu set data Shopee/TikTok), bukan per store individual.

**Q: Show for All Company tidak bisa dimatikan?**  
A: Requirement: lock setelah company lain pakai. **AS-IS:** belum ada lock otomatis — hubungi dev jika behavior tidak sesuai harapan.

**Q: Apakah ada import Excel?**  
A: **Tidak** untuk master. Import data platform via sync API di menu Platform Shipping Service.

**Q: Logistic Label Template untuk apa?**  
A: Rencana custom design resi — **belum aktif**. Sistem masih pakai default resi platform.

## 11. Related Documents

| Doc | Path |
|-----|------|
| Requirement (validasi lengkap) | [requirement.md](./requirement.md) |
| Technical (API/DB) | [technical.md](./technical.md) |
| Platform Shipping Service | [../omni-shipping-service-platform/README.md](../omni-shipping-service-platform/README.md) |
