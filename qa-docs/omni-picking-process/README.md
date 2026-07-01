# Picking Process — Dokumentasi

Menu **Picking Process** (Omni Channel) — operasi scan QR / approve transfer internal dari WH proses ke virtual WH wave (`sequence = 1`). **Bukan** menu Picking List.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator gudang | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

**Relasi Failed Ship:** tahap #1 rantai fulfillment (PL) — [requirement §Relasi FS](./requirement.md#relasi-failed-ship) · [Failed Ship](../supplychain-failed-ship/README.md)

## Route & code

- **FE route:** `/omni/picking-process` → `olshoperp-frontend/src/pages/Omni/PickingProcess/`
- **BE controller:** `Modules/OmniChannel/Http/Controllers/TransferPickingController.php`
- **Underlying:** `StockMutationTransferController` (Supply Chain)
- **Entity scope:** Transfer ke destination `warehouse.sequence = 1` (virtual WH)

## Bukan menu ini

| Menu | Perbedaan |
|------|-----------|
| [Picking List](../omni-picking-list/README.md) | Daftar/registrasi picking list operasional — modul SupplyChain |
| [Waves Management](../omni-waves-management/README.md) | Konfigurasi wave & distribusi SO |
