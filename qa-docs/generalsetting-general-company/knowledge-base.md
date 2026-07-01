---
doc_type: knowledge-base
menu: generalsetting-general-company
menu_name: "General Company"
version: 2.0
last_updated: 2026-06-24
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting, import]
---

# General Company — Knowledge Base

> **Draft** — Diverifikasi terhadap codebase per 2026-06-24. Review PM/QA sebelum final.

## 1. Apa itu General Company?

**General Company** adalah master **mitra bisnis eksternal**: customer, supplier, manufacturer, dan/atau shipper. Satu data bisa punya lebih dari satu peran sekaligus.

**Alias istilah:** Master Customer, Customer, Master Supplier, Supplier, Shipper, Manufacturer Company.

| Item | Nilai |
|------|-------|
| Menu | General Setting → Master Company → **General Company** |
| Route | `/generalsetting/general-company` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Recognize As** | Toggle peran: Customer, Supplier, Shipper, Manufacturer |
| **Default Shipper** | Satu shipper autofill di Sales Order baru |
| **Default Customer** | Customer autofill saat clone order dari platform |
| **Primary Address** | Alamat default di form transaksi (PO, SI, DO) |
| **Auto Add VAT** | Cara sistem menambah PPN: Yes / No / Default by Product |
| **Private data** | `is_all_company = 0` — milik company login, bukan shared global |

## 3. Yang Bisa / Tidak Bisa

### Bisa

- CRUD partner dengan multi-role
- Kontak, alamat, dokumen, accounting COA, payment & currency
- Set default shipper/customer (satu per company)
- Audit log perubahan
- Bulk delete dari datalist

### Tidak Bisa (sistem menolak)

- Inactive company yang masih **default shipper/customer**
- Matikan **Active** atau role Customer/Supplier jika masih ada **saldo piutang/hutang**
- Matikan role **Customer** jika company sudah pernah dipakai di transaksi (toggle terkunci)
- Hapus company yang jadi default shipper/customer
- Hapus shipper yang sudah dipakai di Sales Order
- Punya lebih dari 1 default shipper/customer aktif bersamaan (sistem auto-revoke yang lama)
- Pilih lebih dari 3 Business Field

## 4. Cara Pakai

### 4.1 Buat partner baru

1. Buka **General Company** → **Create**
2. Isi **Code** dan **Name** (wajib)
3. Aktifkan **Recognize As** sesuai kebutuhan
4. Jika Customer → pertimbangkan **Set as Default Customer** untuk clone platform SO
5. Jika Shipper → pertimbangkan **Set as Default Shipper** untuk autofill SO
6. Klik **Save & Next** → lengkapi tab Contacts, Address, Accounting Setting

### 4.2 Setelah onboarding company baru

Sistem otomatis membuat shipper **OLSHOPERP Shipper** (code `OSERP`) sebagai **Default Shipper**. Override jika perlu dengan shipper lain.

### 4.3 Lengkapi accounting sebelum transaksi

Sebelum buat PO/SO/invoice pertama dengan partner tersebut:

1. Buka tab **Accounting Setting**
2. Isi semua COA wajib untuk role yang aktif
3. Atur **Default Currency** dan **Payment Type** jika perlu

Partner tidak muncul di dropdown transaksi sampai COA lengkap.

### 4.4 Import massal (via API / menunggu UI)

Backend mendukung import Excel dengan template kolom: Code, Name, Recognize As (satu role), Description, dan kolom COA. **Tombol Import di layar datalist belum tersedia** — gunakan API atau tunggu update FE.

Detail template & validasi: [requirement.md §13](./requirement.md#13-import-general-company).

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Customer tidak muncul di dropdown SO | COA customer belum lengkap | Lengkapi Accounting Setting |
| Shipper kosong di SO baru | Tidak ada default shipper | Set **Default Shipper** di General Company |
| Clone platform gagal — default customer | Belum set default customer | Aktifkan **Set as Default Customer** pada satu customer |
| Tidak bisa inactive customer (Active OFF) | Saldo piutang masih ada | Lunasi invoice / receive AR dulu |
| Tidak bisa cabut role Customer | Sudah dipakai di transaksi | Role terkunci; company tetap Customer |
| Tidak bisa inactive supplier (Active OFF) | Saldo hutang masih ada | Lunasi payable dulu |
| Tidak bisa hapus shipper OSERP | Masih default atau dipakai SO | Set default ke shipper lain dulu |
| Filter "Yes" tidak match | Typo filter | Ketik `yes`, `y`, atau `ye` |
| Import gagal — template | Header/kolom tidak sesuai | Ikuti format [requirement §13](./requirement.md#133-validasi-import-as-is) |

## 6. FAQ

**Q: Satu company bisa Customer dan Supplier sekaligus?**  
A: Ya, toggle Recognize As independen.

**Q: Kenapa toggle Default Shipper tidak muncul?**  
A: Recognize As Shipper harus aktif.

**Q: Dari mana customer terisi otomatis saat clone order platform?**  
A: Dari company dengan **Set as Default Customer** ON.

**Q: Apa itu OLSHOPERP Shipper?**  
A: Data default sistem saat onboarding; default shipper agar SO langsung punya shipper.

**Q: Payment Type datang dari mana?**  
A: Master Payment Type (`scm_payment_types`) — belum ada menu master terpisah di UI.

**Q: Apakah ada reminder dokumen expired?**  
A: Belum — tab Documents hanya menyimpan data.

## Relasi Instant Settlement

Shipper menentukan rantai gudang virtual → status **Shipped WH 3PL** sebelum upload settlement.

Detail: [Instant Settlement](../accounting-settlement-upload/knowledge-base.md)
