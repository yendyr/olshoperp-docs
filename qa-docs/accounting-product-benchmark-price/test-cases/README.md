# Test Cases — Benchmark COGS (Product Benchmark Price)

Folder ini berisi dokumen spesifikasi test case untuk menu **Finance / Accounting → Report → Benchmark COGS** (`/accounting/product-benchmark-price`).

---

## 📋 Daftar Test Case

### ETM-15688 — [Benchmark COGS] Calculation benchmark COGS untuk SKU Bundle

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-PBC-001` | Header Product Bundle Non-Random — Perhitungan Bundle Sum (Σ B.COGS Komponen × Qty BOM) | [`TC-PBC-001.md`](./TC-PBC-001.md) | DRAFT 🟡 |
| `TC-PBC-002` | Header Product Bundle Variant Random — Perhitungan Highest Bundle Variant (MAX Sibling Non-Random) | [`TC-PBC-002.md`](./TC-PBC-002.md) | DRAFT 🟡 |
| `TC-PBC-003` | Manual COGS Override pada Header Product Bundle — Abaikan Rumus Bundle | [`TC-PBC-003.md`](./TC-PBC-003.md) | DRAFT 🟡 |
| `TC-PBC-004` | Komponen Variant Random di Dalam Detail Bundle — Pakai B.COGS Final Komponen | [`TC-PBC-004.md`](./TC-PBC-004.md) | DRAFT 🟡 |
| `TC-PBC-005` | SKU Rakitan / BOM Assembly (Stockable) — Tidak Menggunakan Rumus Bundle Sum | [`TC-PBC-005.md`](./TC-PBC-005.md) | DRAFT 🟡 |
| `TC-PBC-006` | Regresi Auto-Approve & Snapshot Benchmark COGS pada Sales Order untuk Product Bundle | [`TC-PBC-006.md`](./TC-PBC-006.md) | DRAFT 🟡 |
