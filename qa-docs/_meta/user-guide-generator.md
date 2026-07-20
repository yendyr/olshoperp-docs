# OlshopERP User Guide Generator — Instruksi untuk Cursor

**Role kamu:** technical/UX writer OlshopERP. Input kamu **bukan** requirement mentah — input kamu adalah 3 file yang sudah ada di `docs/qa-docs/<module>-<menu-slug>/` (`requirement.md`, `knowledge-base.md`, `technical.md`). Output kamu adalah **1 file baru: `user-guide.md`**, murni derivatif dari ketiganya, disimpan di **folder/repo yang sama persis** dengan 3 file sumber tersebut — **wajib**, bukan opsional, bukan folder/repo terpisah.

**Beda dengan instruksi source-of-truth (dipakai di Claude, bukan di Cursor):** proses sebelumnya menghasilkan source-of-truth dari requirement mentah untuk dipecah jadi 3 file teknis. Instruksi di dokumen ini **tidak boleh** menambah fakta baru — hanya menyusun ulang & menerjemahkan fakta yang sudah ada di 3 file itu ke bahasa end-user. Kalau kamu merasa perlu menambahkan informasi yang tidak ada di 3 file sumber, itu sinyal untuk berhenti dan tandai, bukan mengarang.

---

## Prinsip

1. **Murni turunan, bukan sumber baru.** Setiap kalimat di `user-guide.md` harus bisa ditelusuri balik ke requirement.md/knowledge-base.md/technical.md. Kalau ada celah informasi yang kamu rasa perlu diisi, tandai `[NEEDS SOURCE UPDATE]` — jangan menebak atau menambah asumsi.
2. **Audience end-user awam** (AP clerk, finance ops, support, tim non-teknis yang baca di Notion/Lark) — bukan QA/dev. **Nol toleransi** untuk field DB, ID invariant (`INV-PI-01`), notasi matematis (`Σ`, `>=`), path file/class, atau istilah kode apa pun di body dokumen ini. Ini lebih ketat dari instruksi source-of-truth yang masih mengizinkan field DB sebagai identifier.
3. **Reframe total section Validasi.** Semua kondisi ditulis ulang dari sudut pandang yang dialami/dilihat user ("kalau kamu isi qty melebihi sisa barang yang belum ditagih, sistem menolak dan kasih tahu batas maksimalnya"), bukan dari sudut pandang sistem ("kondisi X → ditolak").
4. **Fallback non-diagram wajib.** Dokumen ini akan dipublish juga ke tools tanpa dukungan Mermaid penuh (Notion/Lark). Setiap diagram Mermaid harus didampingi versi teks (numbered step list) yang bisa berdiri sendiri tanpa diagram.
5. **Placeholder demo.** Untuk bagian yang melibatkan relasi kompleks antar menu (misalnya rantai Purchase Invoice ke Purchase Return ke Debit Note ke Account Payment), sisipkan callout kosong yang menandai kandidat interactive demo masa depan — jangan diisi konten demo sekarang.
6. **Tone Indonesia, bahasa umum sehari-hari.** Kalimat pendek, orientasi aksi ("klik", "isi", "cek", "jangan lupa").
7. **Ukuran target maksimal 400 baris.** Lebih ringkas dari source-of-truth karena tidak perlu mengulang seluruh detail kolom hidden/teknis.

---

## Struktur Output (WAJIB, urutan tetap)

### Frontmatter YAML (baris 1)
```yaml
---
doc_type: user-guide
menu: <module>-<menu-slug>
menu_name: "<Nama Menu>"
version: 1.0
last_updated: YYYY-MM-DD
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: <version dari source-of-truth yang dipakai>
owner: <PIC>
status: draft
---
```

### 1. Apa Itu & Kenapa Penting
2–3 kalimat awam: menu ini buat apa, siapa yang pakai sehari-hari. Tanpa istilah teknis yang belum dijelaskan.

### 2. Overview Flow & Proses Bisnis
- Rantai proses hulu-hilir: Mermaid `flowchart LR` **plus** fallback numbered list teks (contoh: "1. Purchase Order dibuat. 2. Barang diterima (Purchase Inbound). 3. Tagihan dibuat di sini (Purchase Invoice). 4. Dibayar di Account Payment.")
- Siklus status transaksi: Mermaid `stateDiagram-v2` **plus** fallback tabel status polos (nama status, artinya, bisa diedit atau tidak)

### 3. Sebelum Mulai (Flow Sebelum)
Apa yang harus sudah siap sebelum transaksi ini bisa dibuat — bahasa checklist ("pastikan..."). Kalau relasinya kompleks, sisipkan placeholder:
```
🎬 [Interactive demo akan ditambahkan di sini]
```

### 4. Setelah Selesai (Flow Sesudah)
Apa yang terjadi & langkah lanjutan setelah transaksi ini di-approve/selesai. Placeholder demo yang sama kalau relasinya kompleks.

### 5. Yang Perlu Diperhatikan
Reframe seluruh section Validasi dari 3 file sumber ke format "Kalau kamu ..., maka ...". **Dilarang** pakai format tabel kondisi-sistem/ID validasi (`V1`, `V2`, dst) — itu boleh ada di requirement.md, tidak boleh nongol di sini.

### 6. Langkah-Langkah (Step by Step)
Numbered steps actionable dari Create sampai selesai. Tanpa field backend (`account_payable_coa_id` dsb) — ganti dengan bahasa fungsional ("sistem otomatis menerbitkan jurnal utang"). Placeholder demo di langkah yang kompleks.

### 7. Tips & Hal yang Sering Bikin Bingung
Ambil dari FAQ/troubleshooting knowledge-base.md, ringkas ulang, bahasa paling santai di seluruh dokumen ini.

### 8. Referensi
Link balik ke requirement.md / knowledge-base.md / technical.md untuk yang butuh detail lebih lanjut (developer, QA, atau operator yang mau ngulik).

---

## Self-Check Sebelum Output Final

- [ ] Frontmatter lengkap termasuk `source_docs` dan `source_version`
- [ ] Nol field DB / path file / ID invariant / notasi matematis di body dokumen
- [ ] Setiap Mermaid diagram punya fallback teks yang berdiri sendiri
- [ ] Section 5 (Validasi) 100% reframed ke bahasa "yang dialami user", tanpa ID/tabel gaya QA
- [ ] Placeholder demo tersisip di bagian yang relasinya kompleks (minimal disebutkan lokasinya)
- [ ] Tidak ada satu pun fakta yang tidak bisa ditelusuri balik ke requirement.md/knowledge-base.md/technical.md
- [ ] Total ≤ 400 baris

Kalau ada bagian dari 3 file sumber yang ambigu untuk diterjemahkan ke bahasa awam (istilah teknis tanpa padanan jelas), **tanya dulu**, jangan menebak.

---

**Nama doc type & file (rekomendasi):**
- `doc_type`: `user-guide`
- Nama file: `user-guide.md`
- Lokasi: **wajib** `docs/qa-docs/<module>-<menu-slug>/user-guide.md` — satu folder yang sama persis dengan `requirement.md`, `knowledge-base.md`, `technical.md`. Tidak boleh ditaruh di folder/repo terpisah, meskipun nanti file ini juga di-comot manual ke Notion/Lark oleh tim lain.

---

## Tambahan untuk Rules Cursor

Sudah diintegrasikan ke `.cursor/rules/09-menu-documentation.mdc` dan
`.cursor/rules/qa-docs-standard.mdc`. Ringkas:

```
docs/qa-docs/<module>-<menu-slug>/ WAJIB berisi 5 file:
README.md (index), requirement.md, knowledge-base.md, technical.md,
dan user-guide.md. Kelima-limanya SATU FOLDER.

user-guide.md hanya generate jika 3 layer sumber berstatus review|final
(kecuali pilot golden ref yang disetujui eksplisit).

Setiap kali requirement/KB/technical berubah dan gate terpenuhi,
WAJIB regenerate user-guide.md di commit/PR yang sama.
version user-guide independen; jejak sync lewat source_version.

user-guide.md TIDAK BOLEH dari requirement mentah — hanya dari
requirement + KB + technical di folder yang sama.
```

---

**End of instruksi. Simpan file ini sebagai instruksi pendamping di Project Claude, digunakan oleh Cursor.**
