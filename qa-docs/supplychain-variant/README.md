# Master Variant (Variant Group) — Dokumentasi QA

Menu **Master Variant** / **Variant Group** — master tipe variasi (Color, Size, …) + opsi yang dipakai System Product saat **Enable Variations**.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | pending (placeholder) |

**UI:** `/supplychain/variant` · breadcrumb **Variant Group** · title **Master Variant Type**  
**3 layer:** v1.2 · **Last updated:** 2026-08-12  
**Maintenance owner:** QA — Yemima

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.2 | 2026-08-12 | Create+Default ON+1 opsi → skip inject `random`; save reject Default jika opsi > 1 |
| 1.1 | 2026-08-12 | Lock SP konsumen cross-ref (`-(PARENT)`, soft-delete vs leftover, no auto-rename) |
| 1.0 | 2026-08-12 | Initial AS-IS dari codebase + TO-BE **Set as Default System Product** (`GAP-VAR-01`); test-cases existing tetap di `test-cases/` |

## Deliverables

| Item | Path |
|------|------|
| Brief gabungan (v1.1) | `~/Downloads/improvement-default-variant-master-variant-system-product.md` |
| Jira Master Variant | `~/Downloads/jira-master-variant-set-as-default-system-product.md` |
| Jira System Product | `~/Downloads/jira-system-product-default-variant-create-import-expand.md` |

## Key notes

- Satu baris master = **Variant Group** (`scm_variants`) + banyak **Option** (`scm_variant_options`)
- **Major TO-BE (`GAP-VAR-01`):**
  1. Toggle **Set as Default System Product** (`is_default`)
  2. Create + Default **ON** + tepat **1** opsi → save OK, **jangan** inject `random`
  3. Create + Default **OFF** → inject `random` AS-IS
  4. Save Default ON + opsi **> 1** → **reject + notif** (create & edit)
  5. Max **1** Default ON / company; semua OFF boleh
- Konsumen SP: [system-product §6.3.1–§6.3.2](../system-product/) · GAP-SP-17/18

## Related menus

| Menu | Peran |
|------|--------|
| [System Product](../system-product/) | Enable Variations · parent/child SKU · konsumen Default (TO-BE) |
| [Random SKU](../random-sku/) | Opsi `random` / virtual SKU `-random` |
| [Unit](../supplychain-unit/) | Pola toggle **Set as Default …** (referensi UX) |

## Test cases (existing)

- [test-cases/](./test-cases/) — TC-VAR-001 create, TC-VAR-002 update
