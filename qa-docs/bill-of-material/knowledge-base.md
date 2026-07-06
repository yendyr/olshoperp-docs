---
doc_type: knowledge-base
menu: bill-of-material
menu_name: "Bill of Material"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, glossary, rules, faq]
---
# Bill of Material
---

## Bill of Material (BOM)

*Aliases: BOM, Master BOM, Bill of Material*

### Summary

Menu untuk flag SKU sebagai **Header BOM** (barang jadi siap di-assembling) dan mendefinisikan **Detail BOM** (komponen/bahan untuk produce barang jadi). Hanya SKU yang ter-flag Header BOM dengan status Active yang bisa dipakai sebagai item di transaksi **Assembly**. Hubungan strict **1:1** — 1 SKU header = max 1 BOM, tidak ada versioning.

### Function

- Mengidentifikasi SKU sebagai Header BOM dan/atau Detail BOM
- Mendefinisikan komposisi komponen (SKU + qty + unit) untuk produce barang jadi
- Mendukung 2 jalur create: **Refer from System Product** (pakai SKU existing) atau **Create New** (auto-create system product langsung dari form BOM)
- Mendukung struktur Variant — tiap variant Header BOM punya detail BOM independen
- Sebagai prerequisite/gate untuk transaksi Assembly

### Rules & Validation

### Header BOM

- Hanya product type **SINGLE** & **VARIANT**
- Product dengan flag **Bundle = YES tidak boleh** jadi Header BOM (bundle bersifat non-stockable)
- SKU **Random** tidak boleh jadi Header BOM (non-stockable; lihat glossary *Random SKU*)
- SKU yang sudah ditransaksikan stock-in/stock-out **tetap bisa** dipilih sebagai Header BOM (asal sesuai rules di atas)
- **Strict 1:1** — 1 SKU header = max 1 BOM
- Sumber create:
    1. **Refer from System Product** — pilih dari system product existing
    2. **Create New** — system auto-create system product baru dan flag sebagai Header BOM. Jika toggle Variations ON, system auto-create parent + variants

### Detail BOM

- Hanya product type **SINGLE** & **VARIANT**
- Product dengan flag **Bundle = YES tidak boleh** jadi Detail BOM (harus stockable)
- SKU **Random** tidak boleh jadi Detail BOM
- **Tidak boleh self-reference** — Header BOM sendiri tidak boleh masuk sebagai detail
- **Nested BOM allowed** — Header BOM lain (dari BOM berbeda) boleh dipakai sebagai detail. Use case: sub-assembly
- Default unit = primary unit. Alternate unit boleh dipilih (sesuai setup di system product)
- Qty input: **integer only**, tidak boleh decimal/koma, tidak boleh zero/negative

### Composition Rule (Active Status Gate)

Total komposisi detail BOM harus memenuhi:

> `count(detail_sku) > 1 OR qty(detail_sku) > 1`
> 

Artinya: BOM **tidak valid** jika hanya ada 1 SKU detail dengan qty tepat 1.

**Behavior saat rule violated:**

- Master BOM tetap bisa tersave (karena detail row pakai autosave)
- Toggle Active **force OFF** oleh system, muncul icon warning + notif
- Selama violation belum di-fix, user **tidak bisa** manual switch toggle ke ON
- Referensi UIX: behavior ini konsisten dengan validation di System Product (bundle = YES)

### Active / Inactive Behavior

- **Auto-inactive (system trigger):** composition rule violated
- **Manual toggle:** user bisa switch Active/Inactive bebas — **hanya jika rules terpenuhi**
- Semua perubahan toggle masuk ke audit log
- **Impact saat Inactive:** SKU Header BOM **tidak muncul** di SKU selector pada transaksi Assembly

### Edit & Delete

| Action | Allowed When | Behavior |
| --- | --- | --- |
| Edit BOM (detail/qty/unit) | Selalu boleh | Perubahan hanya berlaku untuk **new** assembly transaction. Assembly yang masih in-progress (belum selesai) tetap refer ke data BOM versi lama — perlu validasi di sisi Assembly module. |
| Edit Header SKU code/name | Boleh via hyperlink ke System Product edit page | Tercatat di audit log Master BOM. |
| Delete BOM | Hanya jika **belum pernah** dipakai di Assembly | Menghilangkan flag Header BOM saja, **tidak menghapus** SKU dari System Product. |
| Inactive BOM | Selalu boleh (selama rules terpenuhi) | SKU di-exclude dari opsi Assembly, BOM record tetap ada. |

### Used In

| Menu | Behavior / Relasi |
| --- | --- |
| **Master Bill of Material** | Form utama CRUD BOM. Datalist, advance filter, export. |
| **Master System Product** | Sumber SKU untuk Header & Detail BOM. Mode "Refer from System Product" pilih SKU existing. Hyperlink di Section BOM redirect ke edit page system product. |
| **Master System Product (Create New flow)** | Saat user pilih "Create New BOM", system auto-create system product. Toggle Variations ON → auto-create parent + variants. |
| **Master System Product (Bundle toggle)** | Cross-validation: SKU yg ter-flag Header BOM tidak bisa di-switch bundle = YES. Akan muncul notif gagal. |
| **Master Variant** | Sumber options variant saat Create New BOM dengan toggle Variations ON. |
| **Master Unit** | Sumber primary/alternate unit untuk Detail BOM. Unit yang sudah ter-relasi di BOM **tidak boleh dihapus** — baik dari Master Unit maupun dari setup unit di System Product. Lihat [Master Unit](../supplychain-unit/requirement.md). |
| **Assembly Transaction** | Konsumer utama BOM. Hanya SKU dengan status Header BOM = Active yang muncul sebagai opsi FG. Saat Open → snapshot ke `scm_work_order_bill_of_materials`. Saat Approve → generate TFI + Outbound WIP + Other Inbound FG. Nested BOM **sequential** — sub-assembly harus di-Assembly dulu. Lihat [Assembly](../supplychain-assembly/requirement.md). |
| **Random SKU** | SKU `-random` tetap ter-generate by system saat Create New BOM dengan Variants ON, tapi di-exclude dari flagging Header BOM. Tidak valid untuk Header maupun Detail BOM. |

### UIX Specification

### General

- UIX semua section mengikuti standar terbaru (contoh: format section Audit Log)
- Audit Log wajib aktif & label informatif. Tracking scope: create, edit detail (SKU/qty/unit), toggle Active/Inactive (auto maupun manual), edit Header SKU code/name, delete

### Page Datalist

- Form: **Master Bill of Material**
- **Advance filter:** semua kolom yang tampil di datalist harus searchable, dengan default operator/key pencarian
- **Export:** default file type `.xls`, include header + detail BOM (basic export dulu; export-all bisa menyusul)

### Page Create / Edit

**Radio button utama:**

| Radio | Tooltip | Input |
| --- | --- | --- |
| **Refer from System Product** | *"Select this option if you want to convert an existing system product into a BOM product."* | Select product dari system product. Validation: hanya tampilkan SINGLE & VARIANT dengan bundle = NO. |
| **Create New BOM** | *"When this feature is enabled, the system will auto-create a product using the code and name you enter here."* | Input SKU code + Name. Toggle **Enable Variations** (UIX referensi: System Product). Jika toggle ON → field select multiple option dari Master Variant. |

**Save behavior — Create New BOM:**

- Toggle Variations **OFF** → auto-generate 1 system product (type SINGLE) + flag Header BOM
- Toggle Variations **ON** → auto-generate parent + variants (type VARIANT) + flag Header BOM ke tiap variant. SKU `random` tetap ter-generate tapi **tidak ter-flag** sebagai Header BOM
- **SKU code conflict:** jika code yang diinput sudah exist di System Product → muncul notif error, BOM **tidak bisa tersave**

**Section BOM (Detail List):**

- UIX referensi: section Bundle di System Product (untuk konsistensi)
- Setiap baris SKU detail punya hyperlink/shortcut untuk edit SKU tsb di System Product → redirect ke **edit page** (bukan datalist)
- Autosave per row saat input detail

### Related Terms

- System Product (Single, Variant, Bundle)
- Random SKU
- Master Variant
- Master Unit (primary/alternate)
- Assembly Transaction
- Audit Log

### Important Notes

- **Stockable requirement.** Header maupun Detail BOM wajib stockable. Karena itu Bundle Product & Random SKU sama-sama di-block dari kedua role.
- **Variant BOM independen per variant.** Saat Header BOM type VARIANT, end user wajib define detail BOM untuk **setiap variant secara terpisah**. System tidak meng-inherit detail BOM antar variant.
- **Nested BOM (non-self) allowed.** Sub-assembly didukung: Header BOM lain boleh masuk sebagai detail BOM, asal bukan Header BOM-nya sendiri.
- **Edit BOM mid-assembly.** Jika ada Assembly transaction yang sedang berjalan saat Master BOM diedit, transaksi tsb harus tetap refer ke data BOM versi lama. Validasi snapshot ini perlu di-handle di sisi Assembly module — bukan di Master BOM.
- **Bundle toggle conflict (2 arah).** Dari edit page System Product, switch bundle toggle ke ON pada SKU yang ter-flag Header BOM akan di-reject dengan notif gagal. Konsisten dengan rule "bundle=YES tidak boleh jadi Header BOM" di sisi Master BOM.
- **Unit lock.** Unit (primary maupun alternate) yang sudah dipakai di BOM tidak bisa dihapus — baik dari Master Unit maupun dari setup unit di System Product.
- **Decimal blocked.** Qty detail BOM integer only. Use case bahan baku dengan satuan pecahan harus dimodel ulang via konversi unit (mis. pakai gram alih-alih kg).
- **Strict 1:1.** Versioning BOM / alternatif resep tidak didukung. 1 SKU header = 1 BOM. Kebutuhan resep alternatif → buat SKU header yang berbeda.
- **Delete vs Inactive.** Delete hanya menghilangkan **flag** Header BOM (SKU tetap ada di System Product) dan hanya bisa dilakukan kalau BOM belum pernah dipakai Assembly. Inactive cuma menyembunyikan SKU dari opsi Assembly, record tetap ada.
- **Permission CRUD.** Mengikuti setting role/access standar — create/update/delete bisa di-set granular per user.

---