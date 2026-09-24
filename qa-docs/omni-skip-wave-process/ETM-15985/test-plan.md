# Test Plan: ETM-15985 — Skip Wave Process Datalist + Import Logs Latency

- **Origin Card:** [ETM-15985](https://erpintegration.atlassian.net/browse/ETM-15985) — `RE-OPEN [Skip Wave Process] - Loading datalist terlalu lama (~20s)`
- **Tipe:** Error / Performance (QA Review · Approved Test Plan @yemimatifani)
- **Menu:** Skip Wave Process (`omni-skip-wave-process` / `/omni/skip-wave-process`)
- **Merdian (read-only):** `https://merdian.olshoperp.com/omni/skip-wave-process`
- **Request ID:** `none`
- **Owner:** QA - Rachmatulloh Yendy
- **Intent:** `new` — 2 NEW, 0 reuse (existing TC-SKWP-* = Advanced Filter ETM-15719 only)
- **Company default:** FAT (`id: 112`)

## Tujuan

Memastikan **first-load datalist** Skip Wave Process dan **list default Import logs** (slideover Log Data) tampil dalam waktu wajar — bukan ~20s / ~15s seperti laporan ETM-15985.

## Catatan override / residual

- **Datalist utama:** Rachy verified OK 21 Sep → treat as **GREEN** untuk first-load ~20 baris (tetap wajib dicatat di TC-01).
- **Import logs slideover:** wajib dijalankan (TC-02). Residual latency Import logs **boleh** Failed → Error Relates nanti; **jangan** buka Error terpisah sekarang.
- SoT kolom Import logs: `requirement.md` **§4.3 Log Data — Import Logs**.

## Validasi vs Requirement

| Sumber | Status | Cukup? |
|---|---|---|
| Card AC ETM-15985 | QA Review / Approved | Ya — SoT latensi datalist |
| `requirement.md` §4.3 Import Logs | review | Ya — kolom & slideover Log Data untuk TC-02 |

## Matriks (2 NEW)

| Kode | Type | Fokus |
|---|---|---|
| SC-SKWP-15985-01 | happy | First load datalist (~20 baris) muncul jauh di bawah ~20 detik |
| SC-SKWP-15985-02 | edge | Slideover Log Data → tab Import logs list default ≤20 row tampil cepat (bukan ~15 detik) |

## Mapping → File

| Skenario | File | tc_code |
|---|---|---|
| SC-SKWP-15985-01 | `test-cases/TC-SKWP-DRAFT-20260921212601.md` | PENDING-20260921212601 |
| SC-SKWP-15985-02 | `test-cases/TC-SKWP-DRAFT-20260921212602.md` | PENDING-20260921212602 |

**Checklist §5C:** 2 skenario → 2 TC.
