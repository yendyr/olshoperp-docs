# Manual Picking List — QA Documentation

| Layer | File | Status |
|-------|------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | review |
| Requirement | [requirement.md](./requirement.md) | review |
| Technical | [technical.md](./technical.md) | review |

**Menu:** Manual Picking List · **Route:** `supplychain/manual-picking-list` · **Module:** SupplyChain  
**Prefix:** `PL-` · **Process type:** `manual picking` · **Entity type:** `TF_INTERNAL`

## Ringkasan

Dokumen ad-hoc picking gudang: alokasi FIFO, reservation stok, proses picking (shared Omni UI), complete → Transfer Internal + Stock Deduction + New PL.

**v2.0 (2026-07-05):** Full rewrite dari PM requirement + verifikasi codebase; relasi Transfer Internal & Warehouse Setting §12 requirement.

## Related menus

- [Transfer Internal](../supplychain-mutation-transfer-internal/README.md)
- [Warehouse Setting](../supplychain-setting/README.md)
- [Omni Picking List](../omni-picking-list/README.md)

**Maintenance owner:** QA — Yemima
