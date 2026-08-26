# Test Cases — ETM-15495

| TC | Title | Status | Automated | Docs |
|----|-------|--------|-----------|------|
| TC-01 | Expand group pada child yang sudah punya stok | draft | ❌ | GAP-SP-18 |
| TC-02 | Confirm leftover — Cancel vs Confirm | draft | ❌ | GAP-SP-18 |
| TC-03 | Stok tidak auto-remap; leftover Active | draft | ❌ | GAP-SP-18 + Stock Remapping |
| TC-04 | Naming SKU baru sesuai fungsi existing | draft | ❌ | §6.3 auto-generate SKU |
| TC-05 | Max 3 variant types setelah expand | draft | ❌ | GAP-SP-06 |
| TC-06 | Zero relation → soft delete + regenerate | draft | ❌ | GAP-SP-18 |
| TC-07 | Stok saja tanpa relasi dokumen → soft delete | draft | ❌ | GAP-SP-18 |
| TC-08 | Regresi hard-block lama tidak muncul | draft | ❌ | GAP-SP-18 |

**Overview lengkap:** [testcase-etm-15495-default-variant-expand.md](./testcase-etm-15495-default-variant-expand.md)

**Prasyarat global**

1. Staging: `https://staging.olshoperp.com/supplychain/product`
2. Login: `playwright@gmail.com` / `12345678`
3. Company uji punya akses System Product edit + minimal 1 gudang untuk cek stok
4. Master Variant punya group **Warna** (min 2 opsi) dan **Motif** atau **Ukuran** (min 2 opsi) — total group pada produk uji ≤ 3 setelah expand
5. SKU uji **baru** (jangan pakai produk produksi)
