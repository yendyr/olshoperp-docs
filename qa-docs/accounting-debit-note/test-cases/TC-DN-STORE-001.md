---
doc_type: e2e-test-case
tc_code: TC-DN-STORE-001
menu: accounting-debit-note
menu_name: "Debit Note"
test_type: happy
title: "Debit Note — Store Field Requirement & Validations"
summary: "Verifikasi validasi field Store pada Debit Note header (optional/nullable, dropdown filter store aktif company, edit lock, datalist filter & export)."
status: draft
owner: QA - Jeiniffer
last_updated: 2026-09-03
requirement_ref: "qa-docs/accounting-debit-note/requirement.md §5.1"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-debit-note
  - accounting-supplier-payment
card_ref: "ETM-15711"
preconditions:
  - "User memilik hak akses Create & Edit Debit Note di /accounting/debit-note."
  - "Terdapat Master General Company aktif dengan is_supplier = true dan setting COA lengkap."
  - "Terdapat Store Aktif, Store Inactive/Soft-deleted, dan Store milik Company lain di sistem."
---

# Test Case Plan: Debit Note — Store Field Requirement & Validations (ETM-15711)

## 📋 Context & Ringkasan Requirement Field Store di Debit Note

1. **Debit Note (Sisi Pembelian / Supplier):** Debit Note digunakan untuk mencatat klaim/deposit/retur ke **Supplier**.
2. **Separasi Supplier vs Store (`GAP-DN-03`):**
   * **Field Supplier:** Wajib berupa **General Company** (berstatus `is_supplier = true` & memiliki setting COA Supplier yang lengkap). Store marketplace **TIDAK BISA** dijadikan pilihan Supplier di Debit Note.
   * **Field Store (Tagging Internal):** Digunakan murni sebagai pelabelan/pengelompokan cabang/toko internal perusahaan untuk kebutuhan *reporting & filtering*.
3. **Karakteristik Field Store di Header Debit Note:**
   * **Status Wajib:** Optional / *Nullable* (boleh dikosongkan).
   * **Sumber Opsi:** Hanya menampilkan Store berstatus **Aktif** (`status = active`) di bawah Company aktif.

---

## 🧪 Matrix Test Case Skenario (ETM-15711)

| TC Code | Test Scenario | Pre-Conditions | Test Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-DN-STORE-001** | Create Debit Note tanpa mengisi field Store (Store = NULL) | Access Create Debit Note | 1. Buka halaman Create Debit Note.<br>2. Isi field wajib (Supplier General Company, Transaction Date, Currency, Rate).<br>3. Biarkan field **Store** kosong (`null`).<br>4. Klik Save Header. | Header Debit Note berhasil tersimpan dengan field Store `NULL` tanpa error validasi. | **High (P0)** |
| **TC-DN-STORE-002** | Create Debit Note dengan memilih 1 Store Aktif | Minimal 1 Store aktif terdaftar | 1. Buka form Create Debit Note.<br>2. Isi Supplier (General Company) & field wajib.<br>3. Pilih 1 Store aktif pada dropdown Store.<br>4. Simpan Header. | Header Debit Note berhasil tersimpan dan tertaut secara presisi ke `store_id` yang dipilih. | **High (P0)** |
| **TC-DN-STORE-003** | Validasi Opsi Dropdown Store (Hanya Store Aktif di Company Aktif) | Terdapat Store Aktif, Inactive, & Company lain | 1. Buka dropdown **Store** pada form Debit Note.<br>2. Periksa daftar opsi Store yang muncul. | Dropdown **hanya menampilkan Store Aktif** pada Company terpilih. Store non-aktif/soft-deleted/milik company lain **TIDAK muncul**. | **High (P0)** |
| **TC-DN-STORE-004** | Validasi Field Supplier vs Store (Memastikan Store Tidak Bisa Dipilih sebagai Supplier) | Master General Company & Master Store | 1. Buka dropdown **Supplier** pada form Debit Note.<br>2. Cari nama Store marketplace. | Dropdown Supplier **hanya menampilkan General Company (`is_supplier = true`)**. Store marketplace **TIDAK BISA** dipilih sebagai Supplier Debit Note (`GAP-DN-03`). | **High (P0)** |
| **TC-DN-STORE-005** | Penguncian Field Store Saat Detail Fund / Return Deposit Ditambahkan | Debit Note memiliki detail fund | 1. Buat header Debit Note dengan Store `Store A`.<br>2. Tambahkan 1 baris Payment Source (Cash/Bank).<br>3. Coba ubah nilai field **Store** di header. | Field **Store** pada header menjadi **terkunci / read-only** (*locked*) selama masih ada baris detail fund/deposit tersimpan. | **Medium (P1)** |
| **TC-DN-STORE-006** | Filter Datalist Debit Note Berdasarkan Store (Advanced Filter) | Terdapat DN dengan Store A, B, & NULL | 1. Buka Datalist Debit Note (`/accounting/debit-note`).<br>2. Gunakan Advanced Filter, pilih **Store = Store A**.<br>3. Klik Apply Filter. | Datalist hanya menampilkan transaksi Debit Note yang tertaut dengan **Store A**. Transaksi Store lain / NULL terfilter dengan benar. | **High (P0)** |
| **TC-DN-STORE-007** | Export Datalist Debit Note dengan Filter Store | Data Debit Note ber-Store | 1. Terapkan filter Store = `Store A` di datalist Debit Note.<br>2. Lakukan **Export Excel/CSV** (With / Without Details).<br>3. Buka file hasil export. | File hasil export hanya memuat transaksi Debit Note milik `Store A`, dan kolom Store menampilkan nama Store yang sesuai. | **Medium (P1)** |
| **TC-DN-STORE-008** | Flow Approval Debit Note Ber-Store & Integrasi ke Account Payment | DN Open dengan Store & detail fund valid | 1. Approve Debit Note.<br>2. Buka menu **Account Payment** (`/accounting/supplier-payment`).<br>3. Gunakan Debit Note tersebut sebagai sumber pelunasan/deposit. | Debit Note berhasil di-approve (jurnal terbentuk), dan saat dipakai di Account Payment, data Store & Supplier tetap konsisten. | **High (P0)** |

---

## 🔍 Catatan Validasi QA

1. **Edit Lock:** Field `Store` di-lock bersamaan dengan `Supplier`, `Currency`, `Exchange Rate`, dan `Transaction Date` setelah detail Payment Source / Return Deposit tersimpan.
2. **Separasi Supplier vs Store (`GAP-DN-03`):** Supplier harus `General Company` dengan `is_supplier = true`. Store marketplace tidak boleh dapat dipilih sebagai Supplier.
