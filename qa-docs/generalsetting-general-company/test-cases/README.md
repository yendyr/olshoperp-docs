# Test Cases — General Company

Katalog testcase E2E/manual untuk menu **General Company**. File per TC mengikuti template `_meta/templates/e2e-test-case.template.md`.

| TC Code | Ringkasan | Automated |
|---------|-----------|-----------|
| [TC-GENCO-001](./TC-GENCO-001.md) | Delete ditolak jika ada relasi transaksi | Ya |
| [TC-GENCO-002](./TC-GENCO-002.md) | Create sebagai Customer saja | Ya |

**Maintenance owner:** QA — Yemima

## Menu terlibat

Beberapa TC melibatkan menu lain (mis. Sales Order untuk data precondition). Lihat field `related_menus` di frontmatter tiap file TC.

## In-app

Buka dari ikon dokumentasi menu (📖) → tab **Test Case Library**, atau langsung:

`/test-case-library?menu=generalsetting-general-company`

## Simulasi hasil run (PR-1)

Tanpa Playwright runner, tim QA/dev bisa menulis hasil ke frontmatter file TC:

```bash
php artisan qa-docs:e2e-test-result TC-GENCO-001 \
  --status=passed \
  --executed-by="Yemima" \
  --log-summary="Simulasi lokal" \
  --snapshot-test-data \
  --runner-email=playwright@gmail.com \
  --runner-company=FAT
```

Setelah deploy docs + `php artisan config:clear`, refresh **Test Case Library** untuk melihat status & **Test Data Used**.

## Execute dari aplikasi (PR-2)

- Tombol **Execute** memanggil `POST /api/qa-docs/e2e-test-cases/{tc_code}/execute`
- Hanya TC dengan `automated: true` + `automated_spec` yang bisa dijalankan
- **Satu test dalam satu waktu** (mutex global) — TC lain menunggu
- Default staging (PR-2): **stub run** — status `passed` + `test_data_used` terisi, belum Playwright nyata (PR-3)

Env API (opsional):

```env
QA_DOCS_E2E_STUB=true
QA_DOCS_E2E_DISPATCH_SYNC=true
E2E_TEST_EMAIL=playwright@gmail.com
E2E_TEST_COMPANY_ID=112
E2E_TEST_COMPANY_CODE=FAT
```

**Company allowlist E2E:** FAT (112), lumicharmsid (153), DEV-STG (13), Lumielle (810), TANRISE (3). Cantumkan `execution_company` di frontmatter TC; jika kosong, pakai env default di atas.
