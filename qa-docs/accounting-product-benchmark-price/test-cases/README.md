# Test Cases — Benchmark COGS (Product Benchmark Price)

Folder ini berisi dokumen spesifikasi test case untuk menu **Finance / Accounting → Report → Benchmark COGS** (`/accounting/product-benchmark-price`).

---

## 📋 Daftar Test Case

### ETM-15688 — [Benchmark COGS] Calculation benchmark COGS untuk SKU Bundle

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-PBC-001` | Header Product Bundle Non-Random — Perhitungan Bundle Sum (Σ B.COGS Komponen × Qty BOM) | [`TC-PBC-001.md`](./TC-PBC-001.md) | PASSED 🟢 |
| `TC-PBC-002` | Header Product Bundle Variant Random — Perhitungan Highest Bundle Variant (MAX Sibling Non-Random) | [`TC-PBC-002.md`](./TC-PBC-002.md) | PASSED 🟢 |
| `TC-PBC-003` | Manual COGS Override pada Header Product Bundle — Abaikan Rumus Bundle | [`TC-PBC-003.md`](./TC-PBC-003.md) | PASSED 🟢 |
| `TC-PBC-004` | Komponen Variant Random di Dalam Detail Bundle — Pakai B.COGS Final Komponen | [`TC-PBC-004.md`](./TC-PBC-004.md) | PASSED 🟢 |
| `TC-PBC-005` | SKU Rakitan / BOM Assembly (Stockable) — Tidak Menggunakan Rumus Bundle Sum | [`TC-PBC-005.md`](./TC-PBC-005.md) | PASSED 🟢 |
| `TC-PBC-006` | Regresi Auto-Approve & Snapshot Benchmark COGS pada Sales Order untuk Product Bundle | [`TC-PBC-006.md`](./TC-PBC-006.md) | PASSED 🟢 |
### ETM-15850 — [Benchmark COGS] - Manual COGS NULL vs 0, wajib Expiry (default +30), hapus override permanen

| Kode Draf | Judul Test Case | File | Status |
|---|---|---|---|
| `PENDING-JENNI-2026091001` | Verifikasi Semantik Manual COGS (NULL vs 0 vs >0) pada Benchmark COGS | [`TC-APB-JENNI-DRAFT-2026091001.md`](./TC-APB-JENNI-DRAFT-2026091001.md) | DRAFT 🟡 |
| `PENDING-JENNI-2026091002` | Validasi Mandatory Expiry Date dan Penghapusan Override Permanen | [`TC-APB-JENNI-DRAFT-2026091002.md`](./TC-APB-JENNI-DRAFT-2026091002.md) | DRAFT 🟡 |
| `PENDING-JENNI-2026091003` | Verifikasi Default Auto Expiry +30 Hari saat Expiry NULL & Preservation of Custom Expiry | [`TC-APB-JENNI-DRAFT-2026091003.md`](./TC-APB-JENNI-DRAFT-2026091003.md) | DRAFT 🟡 |
| `PENDING-JENNI-2026091004` | Verifikasi Validasi & Processing Import Excel Benchmark COGS | [`TC-APB-JENNI-DRAFT-2026091004.md`](./TC-APB-JENNI-DRAFT-2026091004.md) | DRAFT 🟡 |
| `PENDING-JENNI-2026091005` | Verifikasi Penanganan Data Existing via Seeder/Migration Data | [`TC-APB-JENNI-DRAFT-2026091005.md`](./TC-APB-JENNI-DRAFT-2026091005.md) | DRAFT 🟡 |
| `PENDING-JENNI-2026091006` | Verifikasi Audit Log Tracking untuk Aktivitas Perubahan Manual COGS & Expiry | [`TC-APB-JENNI-DRAFT-2026091006.md`](./TC-APB-JENNI-DRAFT-2026091006.md) | DRAFT 🟡 |
