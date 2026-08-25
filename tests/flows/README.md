# E2E Cross-Menu Flows — Registry & Cara Eksekusi

Entrypoint untuk agent/QA yang mau **menjalankan** E2E chain antar menu.
Aturan lengkap (wajib saat **membuat/mengubah** flow): `.cursor/rules/17-e2e-cross-menu-flow.mdc`.

## Flow yang tersedia

| flow_id | Chain | Status | TC flow doc | Spec | Fixture default |
|---------|-------|--------|-------------|------|-----------------|
| `scm-inbound` | PR → PO With PR → Purchase Inbound | ✅ Stabil (hijau 4× berturut, ~2.1 menit) | `qa-docs/flows/scm-inbound/testcase.md` | `tests/specs/flows/scm-inbound.spec.ts` | `tests/fixtures/flows/scm-inbound.fixture.json` |
| `scm-ap-full` | PR → PO → PI → Supplier Invoice → Supplier Payment → Journal | 🔜 Belum dibangun (TC origin 7/7 siap; 2 masih DRAFT menunggu `#renumber-tc`) | — | — | — |
| `fulfillment-omni` | SO → Waves → Picking → Checking → Packing → DO | ⛔ Blocked — requirement 4 menu omni masih draft | — | — | — |

## Menjalankan flow

**Wajib preflight dulu** — flow dengan chain belum lengkap TIDAK BOLEH dieksekusi;
kalau preflight ❌, laporkan gap-nya ke prompter dan tunggu jawaban/lengkapi dulu:

```bash
npm run flow:preflight -- scm-inbound
```

Preflight ✅ → jalankan (spec juga mengulang gate yang sama di `beforeAll`):

```bash
npx playwright test tests/specs/flows/scm-inbound.spec.ts
```

Sebelum membuat/menambah TC apa pun, cek duplikat dulu:

```bash
npm run tc:lint
```

- **Data selalu fresh** — tiap run membuat chain dokumen baru dari phase 1; tidak pernah bergantung dokumen run sebelumnya.
- **Company**: default `lumicharmsid` (153); flow order platform pakai `FAT` (112).
- **Override test data** (tester-specified): salin fixture default, ubah supplier/SKU/qty/`approve_inbound`, lalu:

```bash
OLSHOP_FLOW_FIXTURE=tests/fixtures/flows/custom-run.json npx playwright test tests/specs/flows/scm-inbound.spec.ts
```

- `approve_inbound: true` di fixture = PI ikut di-approve → **memutasi stok**. Default `false`.

## Membaca hasil

| Artefak | Lokasi | Isi |
|---------|--------|-----|
| Summary run terakhir | `playwright-report/flow-summary.md` (+ `.json`) | Per phase: recall TC origin, dokumen tercipta (PR/PO/PI code), status, durasi, error |
| History per flow | `tests/flow-history/{flow_id}/last-run.md` + `prev-run.md` | 2 snapshot terakhir untuk banding before/after; **history = catatan eksekusi, bukan input run berikutnya** |

## Menjalankan TC spesifik (bukan flow)

Spec single-menu tetap di `tests/specs/{menu}/` dan dijalankan seperti biasa, mis.:

```bash
npx playwright test tests/specs/purchase-requisition/pr-raincoat-variant.spec.ts --retries=0
```

Spec origin dan spec flow memanggil **scenario yang sama** (`tests/scenarios/` — 1 fungsi = 1 TC origin, header `Implements: TC-xxx`). Kalau UX menu berubah: update scenario + helper + TC origin menu itu **sekali** — semua spec ikut. Jangan pernah menyalin langkah antar spec.

## Checklist membuat flow baru (ringkas — detail di rule 17)

1. Pastikan tiap langkah menu punya **TC origin** di `qa-docs/{menu-slug}/test-cases/` — kalau belum ada, buat dulu (konfirmasi user).
2. Pastikan tiap TC origin punya **scenario** di `tests/scenarios/` — promosikan dari spec origin bila perlu.
3. Buat `qa-docs/flows/{flow-id}/testcase.md` — tabel recall + glue, frontmatter `recalls:`.
4. Buat `tests/fixtures/flows/{flow-id}.fixture.json` + spec `tests/specs/flows/{flow-id}.spec.ts` (`describe.serial`, judul test **statis**, attach `flow-phase` per phase).
5. Run sampai hijau 3× berturut-turut sebelum dinyatakan stabil; daftarkan di tabel registry di atas.

## Alat eksekusi: MCP vs CLI

- **Browser MCP / browser subagent** — untuk **eksplorasi & diagnosa** (menelusuri UI menu baru, membaca DOM, mereproduksi bug). Temuannya wajib mendarat di `pom-registry/`, `helpers/`, `ui-components.md`, atau revisi TC origin.
- **Playwright CLI** — **satu-satunya jalur eksekusi** TC dan flow. Menjalankan flow via MCP mem-bypass preflight gate, storageState, reporter, dan history → **dilarang**.
- Status `passed` hanya sah dari CLI. Detail: rule `14` §6B.

## Gotcha teknis yang sudah dipelajari (jangan diulang)

> Katalog lengkap per komponen UI (dengan pola kode yang benar): **`tests/ui-components.md`**.

- Judul `describe`/`test` **wajib statis** — nilai dinamis bikin "Test not found in worker".
- `locator.isVisible()` tidak menunggu (timeout diabaikan) — pakai `waitFor`/`expect`.
- Wrapper `[role=dialog]` headlessui dianggap hidden oleh Playwright — deteksi via heading di dalamnya.
- Multiselect: ketikan pertama bisa ditelan re-render; dropdown bisa menutup sendiri — helper `shared/multiselect.ts` sudah menangani (retry + real key events + reopen guard).
- Input numeric-mask (`data-old-value`) menggabungkan nilai lama saat `fill` — select-all dulu + verifikasi.
- PO Create (UX ≥2026-08) auto-membuat draft di server; run yang gagal di tengah meninggalkan draft orphan — sapu berkala via `deleteDraftPlaywrightPos`.
- PI: bulk Use disabled; Use per-baris → dialog Create Inbound Product → wajib **Allocate Full Qty (Clearing)** sebelum Save (kalau tidak: 422 "quantity field is required").
