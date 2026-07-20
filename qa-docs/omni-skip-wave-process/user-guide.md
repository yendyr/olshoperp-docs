---
doc_type: user-guide
menu: omni-skip-wave-process
menu_name: "Skip Wave Process"
version: 1.0
last_updated: 2026-07-20
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: 1.0
owner: QA - Yemima
status: draft
---

# Skip Wave Process — Panduan Pengguna

**Siapa yang baca panduan ini:** warehouse ops, fulfillment lead, support  
**Menu di sistem:** Omni → Skip Wave Process

---

## 1. Apa Itu & Kenapa Penting

Skip Wave Process memproses banyak order sekaligus lewat **upload Excel**: sistem mengirim order ke Default Wave lalu otomatis menyelesaikan tahap gudang sampai **shipped**.

Cocok saat volume tinggi dan kamu tidak ingin bolak-balik Unassign Wave lalu Skip Processing.

---

## 2. Overview Flow & Proses Bisnis

### Rantai proses

```mermaid
flowchart LR
    Upload[Upload Excel] --> Valid[Validasi file]
    Valid --> Wave[Masuk Default Wave]
    Wave --> Skip[Skip Processing otomatis]
    Skip --> Ship[Shipped]
```

**Versi teks:**

1. Siapkan file berisi daftar **Order No**.
2. Upload di Skip Wave Process.
3. Sistem memvalidasi semua baris.
4. Jika lolos, batch masuk antrian → kirim ke Default Wave → skip sampai shipped.
5. Pantau progress di list sampai status **Completed**.

🎬 [Interactive demo akan ditambahkan di sini]

### Status batch

| Status | Artinya |
|--------|---------|
| In Queue | Lolos validasi; menunggu giliran |
| Pending / Processing | Sedang diproses sistem |
| Completed | Selesai (sukses penuh, sebagian, atau gagal di awal) |
| Failed | Wave tidak menemukan order yang bisa diproses |

---

## 3. Sebelum Mulai (Flow Sebelum)

Pastikan:

- Order **approved** (atau processed) dan **belum** masuk Default Wave.
- Order milik **company** yang sedang kamu login.
- Order No **tidak duplikat** dalam satu file.
- Setup gudang (lokasi tahap + binding shipper 3PL) sudah siap.
- File pakai template: header **Order No**, maksimal **1.000** baris.

🎬 [Interactive demo akan ditambahkan di sini]

---

## 4. Setelah Selesai (Flow Sesudah)

- Batch **Completed** → cek Wave Progress & angka Shipped.
- Kalau ada masalah pengiriman setelah shipped → menu **Failed Ship**.
- Batch gagal validasi → buka **Log Data**, perbaiki file, **upload ulang seluruh file**.

🎬 [Interactive demo akan ditambahkan di sini]

---

## 5. Yang Perlu Diperhatikan

- Kalau **satu** Order No salah / tidak ketemu / duplikat, **seluruh file gagal** diproses — tidak ada yang lanjut.
- Boleh upload banyak file, tapi sistem proses **satu per satu** sampai selesai.
- Progress Wave = sudah di Default Wave; kolom Skip Processing = sudah sampai Shipped.
- File di Log Data hanya bisa didownload **24 jam**.
- Tidak ada tombol “lanjutkan hanya yang sukses” — perbaikan = upload ulang.
- Batch bisa menunggu lama jika ada batch lain yang masih jalan (termasuk dari company lain).

---

## 6. Langkah-Langkah (Step by Step)

1. Buka **Omni → Skip Wave Process**.
2. Klik **Import** → download template.
3. Isi kolom **Order No** (satu order per baris).
4. Upload file.
5. Cek toast / **Log Data** — pastikan import sukses.
6. Di list utama, pantau **Wave Progress** dan **Skip Processing** sampai Completed.
7. Jika gagal: klik **Total Order Processed** di Log Data → baca pesan per baris → perbaiki → upload ulang.

🎬 [Interactive demo akan ditambahkan di sini]

---

## 7. Tips & Hal yang Sering Bikin Bingung

- **Semua gagal padahal cuma 1 salah** — memang begitu (all-or-nothing).
- **Angka Processed masih naik** — validasi masih berjalan di background.
- **Lama Pending** — tunggu batch aktif lain selesai.
- **Beda Skip Processing menu** — itu untuk order yang sudah di wave, dipilih dari list.
- **Beda Unassign Wave** — itu hanya sampai Default Wave, tidak auto sampai shipped.
- **Waves Management** — tidak dipakai di jalur ini (langsung skip setelah Default Wave).

---

## 8. Referensi

| Butuh | Buka |
|-------|------|
| Aturan & gap QA | [requirement.md](./requirement.md) |
| Troubleshooting | [knowledge-base.md](./knowledge-base.md) |
| API, job, lock, cron | [technical.md](./technical.md) |

**Related menus:** [Unassign Wave](../omni-unassign-wave/) · [Skip Processing](../omni-skip-processing/) · [Order Process](../omni-process-summary/) · Delivery Order · Failed Ship
