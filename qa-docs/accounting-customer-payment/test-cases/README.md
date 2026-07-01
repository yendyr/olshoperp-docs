# Test Cases — Account Receive

Katalog testcase E2E/manual untuk menu **Account Receive** (Customer Payment / AR). File per TC mengikuti template `_meta/templates/e2e-test-case.template.md`.

| TC Code | Ringkasan | Execute (tombol) |
|---------|-----------|------------------|
| [TC-ARCP-001](./TC-ARCP-001.md) | Single use — insert SI dari modal Available Sales Invoice | Ya |
| [TC-ARCP-002](./TC-ARCP-002.md) | Single use — Save tanpa amount ditolak | Ya |
| [TC-ARCP-003](./TC-ARCP-003.md) | Bulk use — insert beberapa SI (checkbox + Use) dari modal Available | Ya |
| [TC-ARCP-004](./TC-ARCP-004.md) | Bulk select — insert SI dari dropdown Select Invoice | Ya |

**Maintenance owner:** QA — Yemima

## Konteks bug (2026-06-26)

Investigasi pada transaksi **RC-5TM6UX14** (staging FAT): insert detail gagal di UI saat **single use** dari modal **Available Sales Invoice**, padahal backend/API valid. Lihat catatan QA di [TC-ARCP-001](./TC-ARCP-001.md).

Tiga alur insert detail punya endpoint & validasi berbeda — jangan dicampur saat eksekusi:

| Alur | UI | API |
|------|-----|-----|
| Single use | Modal Available → **Use** per baris → sub-modal alokasi → Save | `POST .../customer-payment-detail` |
| Bulk use | Modal Available → checkbox → **Use** (footer) | `POST .../customer-payment-detail-bulk` |
| Bulk select | Dropdown **Select Invoice** di section detail | `POST .../bulk-select` |

## Menu terlibat

| Menu | Peran |
|------|--------|
| [Account Receive](../README.md) | Primary — form edit AR + detail |
| [Sales Invoice](../../accounting-customer-invoice/README.md) | Data precondition — SI outstanding |

## In-app

Dari ikon dokumentasi menu Account Receive → **Test Case Library**, atau:

`/test-case-library?menu=accounting-customer-payment`

## Checklist deploy server (wajib sebelum tim klik Execute)

Setelah merge & deploy **API** (docs ikut repo `olshoperp`):

```bash
php artisan config:clear
```

Pastikan `.env` **API staging** minimal berisi:

```env
# Akun browser E2E (bukan akun yang klik Execute — siapa pun di tim boleh klik)
E2E_TEST_EMAIL=playwright@gmail.com
E2E_TEST_PASSWORD=<password akun playwright staging>

# Company default runner
E2E_TEST_COMPANY_ID=112
E2E_TEST_COMPANY_CODE=FAT

# Mode execute dari Test Case Library (default PR-2 = stub)
QA_DOCS_E2E_STUB=true
QA_DOCS_E2E_DISPATCH_SYNC=true
QA_DOCS_E2E_ENVIRONMENT=staging
```

| Variabel | Wajib? | Keterangan |
|----------|--------|------------|
| `E2E_TEST_EMAIL` | Ya | Login browser saat runner Playwright nyata; tercatat di **Test Data Used** |
| `E2E_TEST_PASSWORD` | Ya | Pasangan password akun runner di staging |
| `E2E_TEST_COMPANY_ID` / `CODE` | Ya | Fallback jika TC tidak set `execution_company` |
| `QA_DOCS_E2E_STUB` | Ya (saat ini) | `true` = Execute langsung **passed** (stub PR-2), belum buka browser |
| `QA_DOCS_E2E_DISPATCH_SYNC` | Disarankan `true` | Job jalan sync; tim langsung lihat hasil tanpa Horizon |

Deploy **frontend** (`olshoperp-frontend`) — halaman Test Case Library sudah ada; tidak perlu env khusus di FE untuk Execute.

### Siapa klik Execute vs akun browser

| | |
|--|--|
| **Klik Execute** | User mana pun yang login ke OlshopERP (email masuk `executed_by`) |
| **Login staging saat test** | Selalu `E2E_TEST_EMAIL` dari env server (`playwright@gmail.com`) |
| **Company** | Dari `execution_company` TC (FAT) |

### Mode stub vs Playwright nyata (PR-3)

| `QA_DOCS_E2E_STUB` | Perilaku Execute |
|--------------------|------------------|
| `true` (default staging) | Stub run → status **passed**, snapshot test data; **tidak** menjalankan file `e2e/*.spec.ts` |
| `false` | Butuh runner VM + Playwright spec di repo frontend — belum production-ready di job (`RunE2eTestCaseJob`) |

Path `automated_spec` mengacu ke file Playwright di repo `olshoperp-frontend/e2e/` (sudah ada untuk keempat TC).

## Catat hasil run (opsional)

```bash
php artisan qa-docs:e2e-test-result TC-ARCP-001 \
  --status=passed \
  --executed-by="Nama QA" \
  --log-summary="Manual staging FAT" \
  --snapshot-test-data \
  --runner-email=playwright@gmail.com \
  --runner-company=FAT
```

**Company allowlist E2E:** FAT (112), lumicharmsid (153), DEV-STG (13), Lumielle (810), TANRISE (3).
