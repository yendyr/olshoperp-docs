# tests/scratch — Script Sekali Pakai & Legacy

Isi folder ini **bukan test case**. Tidak pernah dijalankan suite: `testMatch` hanya
mencakup `**/specs/**/*.spec.ts`, jadi apa pun di sini otomatis di luar run.

> [!WARNING]
> **Jangan dijadikan contoh/pola saat menulis spec baru.** Banyak file di sini
> memakai direct API call, ID/kode dokumen hardcoded, dan selector inline — semuanya
> melanggar standar yang berlaku sekarang (rule `14`, `17`).
> Pola yang benar: `tests/specs/flows/scm-inbound.spec.ts` + `tests/scenarios/` +
> `tests/helpers/`, dengan kontrak komponen di `tests/ui-components.md`.

## Isi

| Kelompok | Asal | Status |
|---|---|---|
| `product-profit-loss/*` (60+ file) | Sesi investigasi/crawling MCP untuk card **ETM-15485** (Product Profit & Loss), Agustus 2026 | Beku — nilainya hanya sebagai catatan penelusuran |
| `product-profit-loss/etm-15485-fresh-source-e2e.spec.ts` | E2E chain 5+ menu, 587 baris, **campur UI crawling + direct API**, `waitForTimeout` statis | **Legacy** — contoh nyata kenapa infrastruktur flow dibuat. Akan digantikan flow ber-`recalls` (rule `17`); jangan direfactor, tulis ulang saat flow penggantinya dibangun |
| `product-profit-loss/etm-15485-continue-from-po.spec.ts` | Lanjutan spec di atas | Legacy — sama |

## Kalau butuh script sekali pakai lagi

Tulis di sini (atau di `tests/specs/` dengan prefix diagnostic `check-`/`inspect-`/
`probe-`/`debug-`/`diag-`/`find-`/`get-`/`read-`/`log-`/`verify-`), dan **jangan beri
tag `@TC-*`/`@FLOW-*`** — `npm test` hanya menjalankan spec bertag.

Jalankan manual dengan menyebut path-nya:

```bash
npx playwright test tests/scratch/product-profit-loss/probe-po-details.spec.ts --retries=0
```

## Kapan boleh dihapus

Bebas dihapus kapan saja — tidak ada TC yang merujuknya sebagai `automated_spec`
(dijaga oleh `npm run tc:lint`). Dipertahankan sementara hanya sebagai jejak
penelusuran ETM-15485.
