## QA Test Result — ETM-15495 (Staging · 2026-08-18)

**Fixture:** `SYSPRO` / `SYSPRO-(PARENT)`  
**Kartu:** [System Product] Bisa menambahkan new variant type atau group ke dalam existing system product yang sudah punya stock.

---

### Precondition

1. Master Variant: Ukuran → `S`; Warna → `biru`, `hijau`; Motif → `doraemon`, `pikachu`
2. Create `SYSPRO` → parent `SYSPRO-(PARENT)`, child `SYSPRO` (Enable Variations Ukuran auto ON)
3. Stock child `SYSPRO`: qty **100**, location Seruni Dropoff, unit price 12.500 — **Approved**

---

### Summary

| TC | Skenario | Status |
|----|----------|--------|
| TC-01 | Expand Warna + Proceed (child berstok) | ✅ PASS |
| TC-02 | Confirm popup — Cancel (klik luar modal) | ✅ PASS |
| TC-03 | Expand Motif + stok leftover tidak pindah | ✅ PASS |
| TC-04 | Max 3 variant types — tolak group ke-4 | ✅ PASS |
| TC-05 | Naming non-Default | ⏭ N/A — fixture Default-origin → defer ETM-15512 TC-07 |
| TC-06 | Zero-relation soft delete | ❌ NOT RUN — butuh SKU baru |
| TC-07 | Stok tanpa relasi dokumen | ❌ NOT RUN — butuh fixture baru |
| TC-08 | Regresi hard-block lama | ✅ PASS (implisit via TC-01) |

**Overall fixture SYSPRO:** ✅ **PASS** untuk scope expand + stok + max 3 group.

---

### Detail run

**TC-02 — Confirm popup, Cancel**
1. Edit `SYSPRO-(PARENT)` → tambah Warna (`biru`, `hijau`) → Save All
2. Popup: *"There are existing variants with stock/transaction relations. These variants will not be deleted (kept as Leftovers), and new variant combinations will be generated. Proceed with saving?"*
3. Cancel (klik di luar modal) → refresh

**Actual:** Warna tidak tersimpan; Ukuran masih tersimpan; stok `SYSPRO` **tetap 100**  
**Status:** ✅ PASS

---

**TC-01 — Expand Warna, Proceed**
1. Tambah variant CLR-SP (`hijau`, `biru`) → Proceed

**Actual:** Child baru `SYSPRO-hijau`, `SYSPRO-biru`; stok `SYSPRO` **masih 100**  
**Status:** ✅ PASS

---

**TC-03 — Expand Motif + assert stok**
1. Tambah Motif (`doraemon`, `pikachu`) → Save

**Actual:**

| SKU | Stok |
|-----|------|
| `SYSPRO` | **100** @ WH Seruni Dropoff |
| `SYSPRO-biru-doraemon` | 0 |
| `SYSPRO-biru-pikachu` | 0 |
| `SYSPRO-hijau-doraemon` | 0 |
| `SYSPRO-hijau-pikachu` | 0 |

Intermediate `SYSPRO-biru` / `SYSPRO-hijau` hilang (soft delete — tanpa stok/relasi)  
**Status:** ✅ PASS

---

**TC-04 — Max 3 variant types**
1. Coba tambah variations ke-4

**Actual:** Blocker: *"The maximum number of variant types you can add is limited to three."* — tidak bisa Add Variations lagi  
**Status:** ✅ PASS

---

### Observasi QA

- Intermediate `SYSPRO-biru` / `SYSPRO-hijau` soft-deleted saat expand Motif — selaras TO-BE zero-relation regenerate.
- Naming omit segment Ukuran (`S`) pada SKU baru — relevan **ETM-15512 TC-07** (Default-origin).

---

### Next step (ETM-15495)

- ❌ TC-06 — fixture SKU baru, zero relation
- ❌ TC-07 — fixture stok tanpa relasi dokumen (jika diminta close penuh)

Result file: `automate testing jira/ETM-15495/results/RESULT-20260818-SYSPRO.md`
