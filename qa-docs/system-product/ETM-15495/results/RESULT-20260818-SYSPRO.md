# RESULT — ETM-15495 manual run SYSPRO (2026-08-18)

**Tester:** manual QA  
**Kartu:** [ETM-15495](https://erpintegration.atlassian.net/browse/ETM-15495)  
**Environment:** Staging  
**Fixture:** `SYSPRO` / `SYSPRO-(PARENT)`  
**Cross-ref dedup:** [MATRIKS-DEDUPLIKASI-ETM-15495-15512.md](../MATRIKS-DEDUPLIKASI-ETM-15495-15512.md)

---

## Precondition (actual)

1. **Master Variant** (3 group):
   - Ukuran → `S`
   - Warna → `biru`, `hijau`
   - Motif → `doraemon`, `pikachu`

2. **SKU uji:** `SYSPRO`
   - Enable Variations (Ukuran) otomatis aktif
   - System generate: parent `SYSPRO-(PARENT)`, child `SYSPRO`

3. **Stock child `SYSPRO`:**
   - Qty = **100**
   - Location destination = Seruni Dropoff
   - Unit price = 12.500
   - Status = **Approved**

---

## Run summary

| TC | Judul | Status | Catatan |
|----|-------|--------|---------|
| TC-01 | Expand group + child berstok (Proceed Warna) | ✅ PASS | Tidak hard-block; 2 child baru; stok leftover 100 |
| TC-02 | Confirm popup — Cancel | ✅ PASS | Popup muncul; cancel klik luar modal; config rollback OK |
| TC-03 | Stok tidak auto-remap (expand Motif) | ✅ PASS | `SYSPRO` = 100; 4 SKU baru = 0 |
| TC-04 | Max 3 variant types (tolak ke-4) | ✅ PASS | Blocker UI max 3 types |
| TC-05 | Naming non-Default | ⏭ N/A | Fixture Default-origin — defer **ETM-15512 TC-07** |
| TC-06 | Zero-relation soft delete | ⏭ NOT RUN | Butuh fixture SKU baru |
| TC-07 | Stok tanpa relasi dokumen | ⏭ NOT RUN | Butuh fixture dedicated |
| TC-08 | Regresi hard-block lama | ✅ PASS (implisit) | Tidak muncul `Cannot add variant…` (via TC-01) |

**Overall SYSPRO run:** **PASS** untuk scope expand + stok + max 3 group. TC-06/TC-07 belum di-run.

---

## TC-02 — Confirm popup, Cancel

**Steps:** Edit `SYSPRO-(PARENT)` → tambah Warna (`biru`, `hijau`) → Save All → cancel klik di luar modal → refresh.

**Actual:**
- Popup: *"There are existing variants with stock/transaction relations. These variants will not be deleted (kept as Leftovers), and new variant combinations will be generated. Proceed with saving?"*
- Cancel + refresh: Warna **tidak tersimpan**; Ukuran **masih tersimpan**; stok **`SYSPRO` tetap 100**

**Verdict:** ✅ PASS

---

## TC-01 — Expand Warna, Proceed

**Steps:** Tambah variant **CLR-SP** (hijau, biru) → Proceed.

**Actual:** Update tersimpan; child baru **`SYSPRO-hijau`**, **`SYSPRO-biru`**; stok **`SYSPRO` masih 100**

**Verdict:** ✅ PASS (+ TC-08 implisit)

---

## TC-03 — Expand Motif + assert stok

**Steps:** Tambah variations **Motif** (`doraemon`, `pikachu`) → Save.

**Actual:**

| SKU | Stok |
|-----|------|
| `SYSPRO` | **100** @ WH Seruni Dropoff |
| `SYSPRO-biru-doraemon` | 0 |
| `SYSPRO-biru-pikachu` | 0 |
| `SYSPRO-hijau-doraemon` | 0 |
| `SYSPRO-hijau-pikachu` | 0 |

Intermediate `SYSPRO-biru` / `SYSPRO-hijau` **tidak ada** (soft delete — zero stok/relasi).

**Verdict:** ✅ PASS — leftover stok tidak pindah; SKU baru stok 0; naming omit segment Ukuran (`S`).

---

## TC-04 — Max 3 variant types

**Steps:** Coba tambah variations ke-4.

**Actual:** Blocker di area Add Variations: *"The maximum number of variant types you can add is limited to three."* — tidak bisa tambah lagi.

**Verdict:** ✅ PASS

---

## Belum di-run

| TC | Next |
|----|------|
| TC-06 | SKU baru, zero relation, expand Motif |
| TC-07 | SKU baru, stok tanpa relasi dokumen |
| TC-05 formal (naming non-Default) | SKU tanpa `-(PARENT)` atau **ETM-15512 TC-07** untuk SYSPRO |
