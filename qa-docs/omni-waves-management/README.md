# Waves Management — Dokumentasi

Menu **Waves Management** (Supply Chain / Omni) — konfigurasi wave untuk mengelompokkan Sales Order dan transfer internal, plus otomasi generate wave.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, warehouse lead | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Route & code

- **FE route:** `/omni/waves-management` → `olshoperp-frontend/src/pages/Omni/WavesManagement/`
- **BE controller:** `Modules/OmniChannel/Http/Controllers/WaveController.php`
- **Primary table:** `omni_waves`
- **Job:** `GenerateWaveJob`

## Related menus

| Menu | Relasi |
|------|--------|
| [Picking Process](../omni-picking-process/README.md) | Approve transfer wave (hidden TF) |
| [Picking List](../omni-picking-list/README.md) | Generate picklist dari wave — **menu berbeda** |
| [Warehouse Binding](../omni-warehouse-binding/README.md) | WH process filter wave |
| [Dev - Sales Platform](../sales-order-general/README.md) | SO masuk MIX wave default |
