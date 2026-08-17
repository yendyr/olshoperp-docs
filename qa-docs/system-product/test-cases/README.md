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
