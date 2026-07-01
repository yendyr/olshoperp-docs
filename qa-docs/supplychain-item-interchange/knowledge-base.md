---
doc_type: knowledge-base
menu: supplychain-item-interchange
menu_name: "Product Interchange"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Product Interchange — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Product Interchange?

**Product Interchange (Item Interchange)** mendefinisikan **pasangan produk yang bisa saling substitusi** saat fulfillment — jika produk A habis, sistem/operator dapat memakai produk B sesuai mapping. Data disimpan di `scm_item_interchanges`.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Master → Product Interchange |
| Route UI | `/supplychain/item-interchange` |
| API prefix | `supplychain/item-interchange` |
| Tabel | `scm_item_interchanges` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| First Item | Produk utama dalam pasangan (terkunci setelah create) |
| Second Item | Produk alternatif/substitusi |
| Vice Versa | Opsi create otomatis pasangan balik B→A |
| Item Interchange Pair | Satu baris first_item_id + second_item_id |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- Buat pasangan interchange antar dua produk aktif
- Opsi **Vice Versa** — auto-create pasangan balik
- Edit **second item** dan description setelah create
- Soft delete pasangan
- Lihat audit log

### Tidak Bisa

- Mengubah **first item** setelah record dibuat
- Memetakan produk ke dirinya sendiri
- Duplikasi pasangan yang sama (A→B)
- Memakai produk inactive (`status ≠ 1`)

## 4. Cara Pakai (How-To)

### Buat pasangan baru

1. Buka **Product Interchange** → **Create**.
2. Pilih **First Product** dan **Second Product** (select2 produk transaksi).
3. Centang **Vice Versa** jika substitusi berlaku dua arah.
4. Isi description opsional.
5. Simpan.

### Edit pasangan

1. Buka edit record.
2. Ubah **Second Product** atau description saja.
3. First product tidak bisa diubah — buat record baru jika perlu ganti first item.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| First/Second product not found | Produk inactive atau salah ID | Pilih produk active |
| First and second item can't be same | SKU sama | Pilih produk berbeda |
| Item interchange already exists | Pasangan duplikat | Cek datalist existing |
| Vice versa gagal | Pasangan balik sudah ada | Hapus/edit pasangan lama |

## 6. FAQ

**Q: Apakah interchange otomatis dipakai picking?**  
A: Mapping disimpan sebagai master; konsumsi di alur fulfillment terpisah (lookup interchange elsewhere).

**Q: Bisakah A→B tanpa B→A?**  
A: Ya — jangan centang Vice Versa.

## 7. Relasi Menu

| Menu | Hubungan |
|------|----------|
| Product General Configuration | Master SKU interchange |
| Picking / Fulfillment | Substitusi produk (downstream) |

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
