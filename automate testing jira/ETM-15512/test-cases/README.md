# Test Cases — ETM-15512

| TC | Title | Status | Automated | Docs |
|----|-------|--------|-----------|------|
| TC-01 | Create Default ON → parent `-(PARENT)` + child | draft | ❌ | GAP-SP-17 |
| TC-02 | OFF Enable Variations → confirm → Single | draft | ❌ | GAP-SP-17 |
| TC-03 | Import Single-eligible + Default ON | draft | ❌ | GAP-SP-17 |
| TC-04 | Import skip explicit variant / parent-used | draft | ❌ | GAP-SP-17 |
| TC-05 | Expand zero-relation → soft delete + regenerate | draft | ❌ | GAP-SP-18 |
| TC-06 | Expand dengan relasi → leftover + confirm | draft | ❌ | GAP-SP-18 |
| TC-07 | Omit Default segment + hide Default column | draft | ❌ | GAP-SP-17/18 |

**Prasyarat global semua TC:**

1. Staging: `https://staging.olshoperp.com/supplychain/product`
2. Login: `playwright@gmail.com` / `12345678`
3. Master Variant punya **tepat 1** group dengan **Set as Default System Product = ON** dan **tepat 1 opsi** (lihat ETM-15511 / GAP-VAR-01)
4. Company uji punya akses System Product create/edit/import
