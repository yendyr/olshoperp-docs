---
doc_type: knowledge-base
menu: supplychain-qc-procedure
menu_name: "QC Procedure"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# QC Procedure — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu QC Procedure?

**QC Procedure** (Receiving Inspection Template) adalah master **checklist quality control** berisi urutan aktivitas inspeksi dengan respons Yes / No / `-`. Template dipakai saat **receiving**, **checking**, dan **packing standardization** pada konfigurasi produk.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Master → QC Procedure |
| Route UI | `/supplychain/qc-procedure` |
| API prefix | `supplychain/qc-procedure` |
| Tabel header | `scm_inspection_templates` |
| Tabel detail | `scm_inspection_template_details` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| QC Procedure / Inspection Template | Header checklist (code, name) |
| Activity | Satu baris pertanyaan/cek dalam checklist |
| Sequence | Urutan aktivitas (1–30, unique per template) |
| `true_text` / `false_text` / `null_text` | Label respons — AS-IS hardcoded `Yes` / `No` / `-` |
| Applied Product | Kolom datalist jumlah produk pakai template (**stub: selalu 0**) |
| Packing Standardization | Panel produk assign QC untuk packing |
| Checking Standardization | Panel produk assign QC untuk checking |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- CRUD header QC procedure
- Tambah/edit/hapus detail activity dengan sequence
- Assign template ke produk via Product Processing Configuration
- Lihat jumlah activity per template di datalist
- Audit log header + detail

### Tidak Bisa

- Mengubah label respons Yes/No/- per activity (hardcoded saat create)
- Duplikasi sequence dalam satu template
- Sequence di luar range 1–30
- Melihat applied product count yang akurat di datalist (stub)

## 4. Cara Pakai (How-To)

### Buat template baru

1. Buka **QC Procedure** → **Create**.
2. Isi Code (max 15 char on create), Name, Description.
3. Simpan header → buka form edit.
4. Di panel **Detail**, tambah activity:
   - **Activity** (teks pertanyaan, max 30 char on create)
   - **Sequence** (1–30, unik per template)
5. Ulangi untuk semua langkah QC.

### Assign ke produk

1. Buka **Product General** atau **Product Inventory Configuration**.
2. Panel **Packing Standardization** atau **Checking Standardization**.
3. Pilih QC Procedure → simpan (`setQcProcedure` / `checkingSetQcProcedure`).

### Nonaktifkan template

1. Edit header → status Inactive.
2. Template tidak muncul di select2 produk.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Sequence already taken | Duplikat sequence | Gunakan nomor urut lain |
| Activity terlalu panjang | Max 30 (store) vs 125 (update) | Pendekkan teks |
| Applied Product selalu 0 | Kolom stub di controller | Abaikan atau cek assign manual di produk |
| Detail grid error | Resource index vs primevue route mismatch | Gunakan endpoint `/qc-procedure-detail/primevue` |

## 6. FAQ

**Q: Apakah QC Procedure sama dengan menu Quality Assurance?**  
A: Ada duplikasi pages di `QualityAssurance/master/ReceivingInspectionTemplate/` — SCM menu canonical untuk supply chain.

**Q: Bisakah custom label Yes/No?**  
A: AS-IS tidak — disimpan constant meskipun form mengirim field custom.

## 7. Relasi Menu

| Menu | Hubungan |
|------|----------|
| Product General Configuration | packing/checking standardization |
| Product Inventory Configuration | packing/checking standardization |
| Receiving / Inbound | Downstream inspection execution |
| Virtual Warehouse Template | Applicability table (terpisah) |

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
