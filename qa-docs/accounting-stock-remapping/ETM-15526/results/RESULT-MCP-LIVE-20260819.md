# RESULT MCP LIVE TESTING -- ETM-15526 -- 2026-08-19

## Metode Testing
**Playwright MCP Server** (Live Browser) - Interactive testing via Accessibility Tree

## Environment
- **Company:** DEV-STG (ID: 13)
- **Account:** playwright@gmail.com
- **Browser:** Chromium (via MCP)
- **Test Cases:** TC-01 (Duplicate Remapped To antar baris)

## Progress Eksekusi

| Step | Status | Detail |
|------|--------|--------|
| 1. Login | ✅ SUCCESS | Berhasil login dengan playwright@gmail.com |
| 2. Switch Company | ✅ SUCCESS | Switch ke DEV-STG (ID: 13) |
| 3. Navigate Menu | ✅ SUCCESS | Buka `/accounting/stock-remapping` |
| 4. Create | ✅ SUCCESS | Buka form `/accounting/stock-remapping/create` |
| 5. Building Selection | ❌ **BLOCKED** | Dropdown Building kosong (API return `data: []`) |

## Blocker Detail

### 1. Building Dropdown Kosong

**API Call:**
```
GET /api/accounting/stock-remapping/select2/warehouse-origin?find_id=&q=Seruni
Status: 200 OK
```

**Response Body:**
```json
{
  "status": {
    "error": 0,
    "title": "Success",
    "message": "Success"
  },
  "data": [],
  "recordsTotal": null
}
```

**Root Cause:**
- Building "Seruni DROP OFF" belum di-assign ke user `playwright@gmail.com` di company DEV-STG
- Atau permission building untuk Stock Remapping belum di-setup

### 2. SKU Test (dari hasil run sebelumnya)
- `RM-Variant-Mix`: ATS = 0 (tidak muncul di Available Products)
- `RM-Variant-White`: ATS = 0
- `RM-Variant-Pink`: ATS = 0

### 3. Import API (dari hasil run sebelumnya)
```
POST /api/accounting/stock-remapping-detail/{id}/import-history/upload
Status: 404 Not Found
```

## Test Case Status

| TC | Tag | Status | Catatan |
|----|-----|--------|---------|
| TC-01 | `@TC-01` | **BLOCKED** | Tidak bisa pilih Building |
| TC-02 | `@TC-02` | NOT RUN | Tergantung TC-01 |
| TC-04 | `@TC-04` | NOT RUN | Tergantung TC-01 |
| TC-05 | `@TC-05` | NOT RUN | Tergantung TC-01 |
| TC-06 | `@TC-06` | NOT RUN | Tergantung TC-01 |
| TC-07 | `@TC-07` | NOT RUN | Tergantung TC-01 |
| TC-13 | `@TC-13` | NOT RUN | Tergantung TC-01 |
| TC-14 | `@TC-14` | NOT RUN | Tergantung TC-01 |
| TC-15 | `@TC-15` | NOT RUN | Import API 404 + tergantung TC-01 |

## Rekomendasi Action

### Immediate (Blocker Utama)
1. **Setup Building Access**
   - Assign "Seruni DROP OFF" ke user playwright@gmail.com di company DEV-STG
   - Atau buat building baru khusus untuk automation testing
   - Verify via: `GET /api/accounting/stock-remapping/select2/warehouse-origin`

2. **Seed Stock Data**
   - Stock IN untuk SKU: RM-Variant-Mix, RM-Variant-White, RM-Variant-Pink
   - Building: Seruni DROP OFF
   - Target: ATS > 0 (minimal 100 per SKU)

3. **Fix Import Endpoint**
   - Perbaiki route 404: `/api/accounting/stock-remapping-detail/{id}/import-history/upload`
   - Atau confirm route yang benar

### Alternative
- **Gunakan Company Lain:** FAT (112) atau lumicharmsid (153) yang sudah punya test data
- **Buat User Baru:** User khusus untuk automation dengan full permission

## Files Ready

Automation code sudah complete, hanya menunggu environment ready:

| File | Status |
|------|--------|
| `tests/helpers/stock-remapping.ts` | ✅ Ready |
| `tests/pom-registry/stock-remapping.yaml` | ✅ Ready |
| `tests/specs/stock-remapping/etm-15526-happy-path.spec.ts` | ✅ Ready |
| `tests/specs/stock-remapping/etm-15526-failed-tcs.spec.ts` | ✅ Ready |
| `tests/helpers/stock-remapping-import-xlsx.ts` | ✅ Ready (for TC-15) |

## Next Steps

Setelah building & stock data ready:
1. Re-run MCP Live Testing dari step Building Selection
2. Complete TC-01 happy path
3. Continue to TC-02, TC-04, TC-05, TC-06, TC-07
4. Test failed scenarios: TC-13, TC-14, TC-15

## Network Trace

Key API calls yang berhasil:
- ✅ `GET /api/gate/user/profile/verified` - 200
- ✅ `GET /api/sidebar-menu` - 200
- ✅ `GET /api/accounting/stock-remapping/default-values` - 200
- ❌ `GET /api/accounting/stock-remapping/select2/warehouse-origin` - 200 (but empty data)

---

**Kesimpulan:** Environment DEV-STG belum siap untuk testing. Perlu setup building access + seed stock data sebelum lanjut.
