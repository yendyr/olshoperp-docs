# Test Cases — System Product



Prefix folder: `SYSPROD`.



Card [ETM-15495](https://erpintegration.atlassian.net/browse/ETM-15495) — Default Variant create/import + expand leftover (GAP-SP-17 / GAP-SP-18): **TC-SYSPROD-004–032**.



Prasyarat Master Variant Default: GAP-VAR-01 / [ETM-15511](https://erpintegration.atlassian.net/browse/ETM-15511). Folder `automate testing jira/ETM-15512/` **bukan** katalog canonical.



**OFF Enable Variations** bukan 1 case. V-02 hanya “boleh OFF → Single + confirm”. Jangan treat `TC-SYSPROD-005` sebagai cover semua. Urutan: `005` → `013` → `020` → `018`/`019` → `014` → `015` → `021` → `017` → `016`.



**Import** juga bukan 1 case. Dropdown: **New Product** / **Update Product** / **Update Variant Product**. `006` = happy Import New; skip/Type/Default OFF/campur = `022–026`. `020` = OFF di form setelah import, bukan file Update. Expand UI (`007`/`008`) **tidak** cover import. Import New: `006` → `022`/`023` → `024` → `025` → `026`. Import Update: `027` → `028` → `029` → `030` → `031` → `032`.



| TC Code | Title | Status | Automated | Last Updated |

|---------|-------|--------|-----------|-------------|

| TC-SYSPROD-001 | Membuat SKU Single di datalist System Product (SKU-BLENDER) | review | ✅ | 2026-07-02 |

| TC-SYSPROD-002 | Membuat SKU Variant 4 warna di datalist System Product (SKU-EMBER) | review | ✅ | 2026-07-02 |

| TC-SYSPROD-003 | Membuat SKU Variant 6 warna di datalist System Product (SKU-WENTER) | draft | ❌ | 2026-07-07 |

| TC-SYSPROD-004 | Create + Default ON — parent SKU-(PARENT), child = SKU user | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-005 | OFF Variations — form create Default ON, **belum persist**, zero relation (V-02 cancel/confirm) | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-006 | Import **New** — Single-eligible + Default ON → parent -(PARENT) + child = SKU file | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-007 | Expand Variant Group — child zero-relation: soft delete + regenerate ID baru | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-008 | Expand saat child berelasi — leftover + confirm; Stock ID/qty tidak berubah; tidak auto-rename | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-009 | SKU baru omit opsi Default; kolom Default group hidden di datatable variant | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-010 | Error — Default group hitung ke max 3 types; group ke-4 ditolak (GAP-SP-06 FE only) | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-011 | Error/gap — child punya stok tapi zero haveRelations: leftover vs soft-delete | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-012 | Error — hard-block haveRelations masih muncul; auto-rename leftover | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-013 | OFF Variations — Default **sudah Save**, zero relation; identitas SKU user vs ghost `-(PARENT)` | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-014 | OFF Variations — child **punya stok**, zero haveRelations (jangan silent-delete inventory) | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-015 | OFF Variations — child **haveRelations** PR/PO/inbound/outbound/WO/binding/BOM/bundle | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-016 | OFF Variations — setelah **leftover expand** (banyak child Active); jangan mass-delete | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-017 | OFF Variations — header **bundle** sudah Variant (Default create); lock `product_relation` | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-018 | OFF Variations — confirm UI **tanpa persist** / navigasi pergi (jangan half-state) | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-019 | OFF lalu **ON lagi** — unsaved vs saved zero-relation (jangan duplikasi / `-(PARENT)-(PARENT)`) | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-020 | OFF Variations — **form** setelah Import New Default, zero relation (bukan file Update) | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-021 | OFF Variations — child **hanya** SO / assembly / TI (`checkTransaction` tidak cek, leftover tetap mengunci) | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-022 | Import **New** — skip auto-default (Variant Type+Option eksplisit) | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-023 | Import **New** — skip auto-default (SKU dipakai sebagai Parent di row lain) | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-024 | Import **New** — Type `single` vs blank (AS-IS reject vs TO-BE Default) | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-025 | Import **New** — semua Master Default OFF → Single tetap mungkin | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-026 | Import **New** — satu file campur eligible + skip + row gagal (partial) | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-027 | Import **Update Product** — Default sudah persist; update field saja; tree/stok utuh | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-028 | Import **Update Product** — existing Single + Default ON **jangan** auto-convert | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-029 | Import **Update Product** — target child vs parent `-(PARENT)`; Stock ID tidak pindah | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-030 | Import **Update Variant Product** — expand zero-relation (path import, bukan edit UI) | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-031 | Import **Update Variant Product** — child berelasi/stok: leftover vs hard-block | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-032 | Pipeline import: New → Update Product → Update Variant (tanpa Save form) | draft | ❌ | 2026-08-17 |

| TC-SYSPROD-BUNDLE-001 | Membuat parent SKU bundle dari detail variant + single parent (TRUZZ Doll Collectors Pack) | review | ✅ | 2026-07-10 |
| TC-SYSPROD-033 | Expand Variant Group saat child sudah punya stok — leftover + confirm, stok tidak pindah | draft | ❌ | 2026-08-18 |

| TC-SYSPROD-034 | Expand Variant Group saat child tanpa relasi — soft delete obsolete + regenerate SKU baru | draft | ❌ | 2026-08-18 |

| TC-SYSPROD-035 | Create Manual Single dengan Default ON → Auto Variant | draft | ❌ | 2026-08-21 |

| TC-SYSPROD-036 | OFF Enable Variations → Confirm Popup → Single | draft | ❌ | 2026-08-21 |

| TC-SYSPROD-037 | Import Single-eligible + Default ON → Variant | draft | ❌ | 2026-08-21 |

| TC-SYSPROD-038 | Import skip explicit variant / parent-used | draft | ❌ | 2026-08-21 |

| TC-SYSPROD-039 | Expand zero-relation → soft delete + regenerate | draft | ❌ | 2026-08-21 |

| TC-SYSPROD-040 | Expand dengan relasi → leftover + confirm | draft | ❌ | 2026-08-21 |

| TC-SYSPROD-041 | Omit Default segment + hide Default column | draft | ❌ | 2026-08-21 |
| PENDING-20260910154001 | Upload Manual Foto Produk > 1 MB (Validation Error & Prevention 500) | draft | ❌ | 2026-09-10 |
| PENDING-20260910154002 | Import Product Images Excel - Error Log Format & Validation Accuracy | draft | ❌ | 2026-09-10 |
| PENDING-20260910154003 | Import File Gambar 0 KB via Google Drive (Empty File Rejection) | draft | ❌ | 2026-09-10 |

### ETM-15944 — [System Product] Upload Gambar pada Spesifik Varian Meng-update Seluruh Varian Child Lainnya saat Default Variant Aktif

| TC Code | Judul Test Case | File | Status Hasil | Last Updated |
|---|---|---|---|---|
| `TC-SYSPROD-042` | [Upload Gambar via Import pada Spesifik Varian Child saat Default Variant Aktif](./TC-SYSPROD-042.md) | [`TC-SYSPROD-042.md`](./TC-SYSPROD-042.md) | **FAILED** ❌ | 2026-09-16 |
| `TC-SYSPROD-043` | [Upload Manual Foto Produk ke Varian Child melalui Section Product Detail](./TC-SYSPROD-043.md) | [`TC-SYSPROD-043.md`](./TC-SYSPROD-043.md) | **FAILED** ❌ | 2026-09-16 |
| `TC-SYSPROD-044` | [Upload Foto Utama pada Level Parent Tidak Menimpa Foto Spesifik Varian Child](./TC-SYSPROD-044.md) | [`TC-SYSPROD-044.md`](./TC-SYSPROD-044.md) | **PASSED** ✅ | 2026-09-16 |
| `TC-SYSPROD-045` | [Ganti / Replace Foto pada Varian Child yang Sudah Memiliki Gambar](./TC-SYSPROD-045.md) | [`TC-SYSPROD-045.md`](./TC-SYSPROD-045.md) | **PASSED** ✅ | 2026-09-16 |
| `TC-SYSPROD-046` | [Bulk Upload Multiple Foto untuk Varian Berbeda Sekaligus via 1 File Import](./TC-SYSPROD-046.md) | [`TC-SYSPROD-046.md`](./TC-SYSPROD-046.md) | **PASSED** ✅ | 2026-09-16 |

### ETM-15120 — [System Product] Konfigurasi dimensi dan berat kini diatur per unit

Origin Card: [ETM-15120](https://erpintegration.atlassian.net/browse/ETM-15120)

| TC Code | Judul Test Case | Tipe | File | Status Hasil | Last Updated |
|---|---|:---:|---|:---:|:---:|
| `TC-SYSPROD-15120-01` | [T01: Buka Create System Product Baru (Unit Configuration Default & Editable Primary)](./TC-SYSPROD-15120-01.md) | `happy` | [`TC-SYSPROD-15120-01.md`](./TC-SYSPROD-15120-01.md) | **PASSED** ✅ | 2026-09-27 |
| `TC-SYSPROD-15120-02` | [T02: Klik Edit pada Primary Unit yang Sudah Dipakai Transaksi](./TC-SYSPROD-15120-02.md) | `happy` | [`TC-SYSPROD-15120-02.md`](./TC-SYSPROD-15120-02.md) | **PASSED** ✅ | 2026-09-27 |
| `TC-SYSPROD-15120-03` | [T03: Klik Edit pada Alternate Unit yang Belum Dipakai Transaksi](./TC-SYSPROD-15120-03.md) | `happy` | [`TC-SYSPROD-15120-03.md`](./TC-SYSPROD-15120-03.md) | **PASSED** ✅ | 2026-09-27 |
| `TC-SYSPROD-15120-04` | [T04: Klik Edit pada Alternate Unit yang Sudah Dipakai Transaksi](./TC-SYSPROD-15120-04.md) | `happy` | [`TC-SYSPROD-15120-04.md`](./TC-SYSPROD-15120-04.md) | **PASSED** ✅ | 2026-09-27 |
| `TC-SYSPROD-15120-05` | [T05: Tambah D&W Profile dari Modal Konfigurasi D&W](./TC-SYSPROD-15120-05.md) | `happy` | [`TC-SYSPROD-15120-05.md`](./TC-SYSPROD-15120-05.md) | **PASSED** ✅ | 2026-09-27 |
| `TC-SYSPROD-15120-06` | [T06: Set Platform Default di Unit Lain (Cross-Unit Mutual Exclusion)](./TC-SYSPROD-15120-06.md) | `happy` | [`TC-SYSPROD-15120-06.md`](./TC-SYSPROD-15120-06.md) | **PASSED** ✅ | 2026-09-27 |
| `TC-SYSPROD-15120-07` | [T07: Set Trx & Report Default di Unit Lain (Cross-Unit Mutual Exclusion)](./TC-SYSPROD-15120-07.md) | `happy` | [`TC-SYSPROD-15120-07.md`](./TC-SYSPROD-15120-07.md) | **PASSED** ✅ | 2026-09-27 |
| `TC-SYSPROD-15120-08` | [T08: Toggle OFF Baris D&W yang Sedang Menjadi Default (Auto-Clear State)](./TC-SYSPROD-15120-08.md) | `edge` | [`TC-SYSPROD-15120-08.md`](./TC-SYSPROD-15120-08.md) | **PASSED** ✅ | 2026-09-27 |
| `TC-SYSPROD-15120-09` | [T09: Pengelolaan dan Penambahan Baris D&W Terisolasi per Unit](./TC-SYSPROD-15120-09.md) | `happy` | [`TC-SYSPROD-15120-09.md`](./TC-SYSPROD-15120-09.md) | **PASSED** ✅ | 2026-09-27 |
| `TC-SYSPROD-15120-10` | [T10: System Product dengan Variant (Pewarisan Unit Parent dan Redirect Child)](./TC-SYSPROD-15120-10.md) | `happy` | [`TC-SYSPROD-15120-10.md`](./TC-SYSPROD-15120-10.md) | **PASSED** ✅ | 2026-09-27 |
| `TC-SYSPROD-15120-11` | [T11: Hapus Alternate Unit yang Belum Dipakai Transaksi](./TC-SYSPROD-15120-11.md) | `happy` | [`TC-SYSPROD-15120-11.md`](./TC-SYSPROD-15120-11.md) | **PASSED** ✅ | 2026-09-27 |
| `TC-SYSPROD-15120-12` | [T12: Proteksi Hapus Alternate Unit yang Sudah Dipakai Transaksi (Delete Disabled)](./TC-SYSPROD-15120-12.md) | `happy` | [`TC-SYSPROD-15120-12.md`](./TC-SYSPROD-15120-12.md) | **PASSED** ✅ | 2026-09-27 |
| `TC-SYSPROD-15120-13` | [T13: Proteksi Permanen Primary Unit (Ketiadaan Opsi Delete)](./TC-SYSPROD-15120-13.md) | `happy` | [`TC-SYSPROD-15120-13.md`](./TC-SYSPROD-15120-13.md) | **PASSED** ✅ | 2026-09-27 |
| `TC-SYSPROD-15120-FINDING` | [FINDING: Validasi Nilai 0 / Null dan Label Kosong Lolos pada Modal D&W](./TC-SYSPROD-15120-FINDING.md) | `negative` | [`TC-SYSPROD-15120-FINDING.md`](./TC-SYSPROD-15120-FINDING.md) | **FAILED** ❌ | 2026-09-27 |










