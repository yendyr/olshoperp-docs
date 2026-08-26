# Warehouse Structure — Validasi Header & Child Warehouse Generator

Validasi Basic Information (Code / Name / Type) dan Child Warehouse Generator (Prefix / Prefix Type).

| TC | Fokus | Tag automation |
|----|--------|----------------|
| TC-01 | Code invalid (>50 no space; <50 with space) | `@TC-WHSTR-VAL-01` |
| TC-02 | Name > 150 karakter | `@TC-WHSTR-VAL-02` |
| TC-03 | Type kosong | `@TC-WHSTR-VAL-03` |
| TC-04 | Prefix duplicate exact | `@TC-WHSTR-VAL-04` |
| TC-05 | Prefix duplicate case-insensitive | `@TC-WHSTR-VAL-05` |
| TC-06 | Prefix non-alphabet (huruf+angka; huruf+simbol) | `@TC-WHSTR-VAL-06` |
| TC-07 | Prefix Type beda antar level → success | `@TC-WHSTR-VAL-07` |
| TC-08 | 1 baris prefix invalid (Numeric keduanya) | `@TC-WHSTR-VAL-08` |

**Spec:** `tests/specs/warehouse-structure/whstr-header-generator-validation.spec.ts`  
**Company:** lumicharmsid (153)  
**Requirement:** `qa-docs/supplychain-warehouse-structure/requirement.md` — V-01, V-02, V-03, V-07
