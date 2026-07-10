---
doc_type: knowledge-base
menu: omni-other-cost
menu_name: "Other Cost"
version: 1.3
last_updated: 2026-07-10
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Master Other Cost — Knowledge Base

## 1. Apa itu Master Other Cost?

**Master Other Cost** adalah daftar jenis biaya tambahan (selain harga barang utama) yang dipakai di transaksi seperti Purchase Order, Sales Order, Purchase Invoice, dan Sales Invoice. Setiap jenis biaya dihubungkan ke **satu akun COA (Expense)** agar jurnal otomatis benar saat transaksi di-approve.

Contoh: biaya klaim selisih ongkir, biaya packing tambahan, atau biaya administrasi.

**Lokasi menu:** FA → Master → Other Cost (`/omni/other-cost`)

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Other Cost | Biaya tambahan di luar harga produk |
| Other Cost COA | Akun buku besar (COA) tipe **Expense** tempat biaya ini dicatat |
| Applied Store | Toko tipe **Others (General)** yang boleh memakai jenis biaya ini |
| All Stores | Semua toko Others yang aktif — termasuk toko baru yang ditambahkan kemudian |
| Active | Status aktif; biaya inactive tidak muncul di transaksi **baru** |
| Instant Settlement | Proses upload dana cair marketplace; template General memuat kolom `OC: {kode}` dari master ini |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Membuat, mengedit, dan menghapus (soft delete) jenis biaya lain-lain
- Menghubungkan setiap biaya ke satu COA Expense (akun paling detail / leaf)
- Mengatur biaya berlaku untuk **semua toko Others** atau **toko tertentu saja**
- Menonaktifkan biaya tanpa menghapus data transaksi lama
- Melihat riwayat perubahan di **Audit Log** (halaman Edit)
- Export data halaman aktif ke Excel
- Menampilkan data yang sudah dihapus lewat checkbox **Show Deleted Data**

### Tidak Bisa
- Memilih COA induk (parent) — hanya COA paling bawah (leaf) yang boleh
- Memilih toko platform (Shopee, TikTok, Lazada, dll.) di Applied Store — hanya toko tipe **Others**
- Memakai biaya **inactive** di transaksi baru (lewat dropdown; data lama tetap ada)
- Mengatur tariff/persentase di form — fitur tidak aktif di UI saat ini
- Import Excel dari datalist — API backend ada, tombol UI belum tersedia

## 4. Cara Pakai (How-To)

### 4.1 Membuat Other Cost baru

1. Buka **FA → Master → Other Cost**.
2. Klik **Create**.
3. Isi **Code** (unik, tanpa spasi — disarankan) dan **Name**.
4. Pilih **Other Cost COA** — hanya akun Expense aktif yang muncul.
5. Atur **Applied Store**:
   - **All Stores** — berlaku untuk semua toko Others aktif (default).
   - **Applied Store** — pilih satu atau lebih toko secara manual.
6. Isi **Description** (opsional).
7. Pastikan toggle **Active** = Yes.
8. Klik **Save & Next**.

> **Prasyarat:** Setting **Other Cost Owner** harus sudah dikonfigurasi di global setting perusahaan. Jika belum, sistem menolak penyimpanan.

### 4.2 Mengubah status Active menjadi Inactive

1. Buka halaman **Edit** Other Cost.
2. Matikan toggle **Active**.
3. Perubahan langsung tersimpan (auto-save).

**Dampak:**
- Biaya **tidak muncul** lagi di dropdown transaksi baru.
- Transaksi yang **sudah** memakai biaya ini (misal PO lama → PI turunan) **tetap** bisa memakainya.

### 4.3 Melihat data yang sudah dihapus

1. Di datalist, centang **Show Deleted Data**.
2. Baris yang sudah di-soft-delete akan muncul dengan label **Deleted** di kolom Action.

### 4.4 Hubungan dengan Instant Settlement

Saat mengunduh template **Instant Settlement General** untuk sebuah toko Others, sistem hanya memasukkan Other Cost yang:
- Status **Active**, dan
- **All Stores**, atau
- **Applied Store** mencakup toko tersebut.

Other Cost tanpa store terpilih (Applied Store kosong) **tidak** masuk template.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Error "Configure global setting in section other cost owner" | Setting Other Cost Owner belum ada untuk company login | Konfigurasi di global setting Other Cost Owner |
| Data Other Cost tidak muncul / salah company | Login dengan company berbeda | Other Cost scoped per company (`owned_by`) — hanya tampil untuk company yang sedang login |
| Error "Selected COA must be smallest COA code" | COA yang dipilih masih punya sub-akun (parent) | Pilih COA level paling bawah (leaf) |
| Error "Invalid input COA" / owner tidak match | COA bukan milik company aktif | Pilih COA milik company yang sedang login |
| Other Cost tidak muncul di template Settlement | Inactive, Applied Store tidak mencakup toko, atau tidak pilih store sama sekali | Cek status Active & konfigurasi Applied Store |
| Other Cost inactive masih di invoice lama | Perilaku normal — warisan dari dokumen induk | Tidak perlu diperbaiki |
| Tidak bisa edit | Data sudah di-soft-delete | Uncheck Show Deleted tidak membantu edit — data deleted read-only |

## 6. FAQ

**Q: Apa bedanya Other Cost dan Other Discount?**  
A: Other Cost = biaya tambahan (menambah nilai). Other Discount = potongan/diskon (mengurangi nilai). Keduanya master terpisah dengan struktur serupa.

**Q: Apakah Account Receive / Account Payment punya picker Other Cost?**  
A: Tidak langsung. Biaya muncul melalui Sales Invoice / Purchase Invoice yang sudah memuat line Other Cost.

**Q: Kenapa toko Shopee tidak muncul di Applied Store?**  
A: Field ini khusus toko tipe **Others (General)** untuk **Instant Settlement General**. Settlement platform memakai mapping terpisah.

**Q: Default Applied Store saat create?**  
A: **All Stores** — semua toko Others aktif otomatis tercakup.

**Q: Data milik company mana?**  
A: Saat create, data disimpan dengan `owned_by` = company yang sedang login. Datalist hanya menampilkan data company tersebut.

**Q: PO sudah pakai Other Cost, lalu di-inactive — PI dari PO masih bisa?**  
A: **Ya.** Line warisan dari PO tetap ikut ke PI meski master sudah inactive.

**Q: Apakah perlu blokir inactive lewat API langsung?**  
A: **Tidak.** Dropdown sudah filter untuk input baru; warisan dokumen tetap jalan.

**Q: COA class apa yang boleh?**  
A: Standar bisnis di **master**: **Expense** + **Other Revenue & Expenses**. Form manual saat ini hanya Expense (akan diselaraskan — task dev).

**Q: Apakah COA di Purchase Invoice harus sama dengan master?**  
A: **Tidak wajib.** COA di master adalah **default**. Di Purchase Invoice, user boleh override COA per baris Additional Cost sebelum approve — tanpa mengubah master. Lihat [Purchase Invoice §8.3](../accounting-supplier-invoice/requirement.md#83-coa-editable-per-baris-change-req-2026-07).

**Q: Fitur Import — kolom Applied Store isi apa?**  
A: **Nama store** (sama seperti picker form), dipisah koma, atau `All`. Bukan kode store.
